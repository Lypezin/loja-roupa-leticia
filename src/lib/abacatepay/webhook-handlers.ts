import { NextResponse } from "next/server"
import { normalizeAbacatePayStatus } from "@/lib/abacatepay"
import { mergeAttemptRawResponse } from "@/lib/payment-attempts"
import type { Json } from "@/lib/supabase/database.types"
import { findPaymentAttempt, markAttemptStatus, markOrderStatus, finalizePaymentOrder } from "./webhook-db"
import type { PaymentEventDetails } from "./webhook-utils"

export type PaymentEventProcessingResult = {
    action: string
    ignored?: string
}

function toWebhookResponse(result: PaymentEventProcessingResult) {
    return NextResponse.json({ received: true, ...result }, { status: 200 })
}

function isManualReviewError(message: string) {
    return message.startsWith("CHECKOUT_STOCK_CONFLICT:")
        || message.startsWith("CHECKOUT_ITEM_INVALID:")
        || message.startsWith("CHECKOUT_ITEMS_INVALID:")
}

async function markAttemptForManualReview(
    attempt: Awaited<ReturnType<typeof findPaymentAttempt>>,
    details: PaymentEventDetails,
    reason: string,
) {
    if (!attempt) {
        return
    }

    await markAttemptStatus(attempt.id, {
        status: "paid_manual_review",
        checkout_id: details.checkoutId || attempt.checkout_id,
        receipt_url: details.receiptUrl || attempt.receipt_url,
        payment_method: details.paymentMethod || attempt.payment_method,
        raw_response: mergeAttemptRawResponse(attempt.raw_response, {
            latest_provider_payload: details.payload,
            manual_review_reason: reason,
            manual_review_event: details.event,
        }),
    })
}

export async function processCompletedEvent(details: PaymentEventDetails): Promise<PaymentEventProcessingResult> {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)

    if (!attempt) {
        console.error("Tentativa de pagamento nao encontrada para evento da AbacatePay.", details)
        return { action: "ignored", ignored: "missing_attempt" }
    }

    if (attempt.status === "superseded" || attempt.status === "paid_manual_review") {
        await markAttemptForManualReview(attempt, details, "paid_on_superseded_or_flagged_link")
        return { action: "manual_review" }
    }

    let data: { action: string; order_id: string }[] | null

    try {
        data = await finalizePaymentOrder(
            details.checkoutId || "",
            details.externalId || attempt.external_id,
            attempt.user_id || "",
            attempt.total_amount,
            details.customerEmail || attempt.customer_email || "",
            details.customerName || attempt.customer_name || "",
            (attempt.shipping_address ?? null) as Json,
            attempt.trusted_items,
            attempt.checkout_source || "storefront",
            details.paymentMethod || "",
            details.receiptUrl || attempt.receipt_url || "",
            details.status || attempt.status || "",
            details.transactionId || details.checkoutId || attempt.checkout_id || "",
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : "payment_finalization_failed"

        if (isManualReviewError(message)) {
            await markAttemptForManualReview(attempt, details, message)
            return { action: "manual_review" }
        }

        throw error
    }

    await markAttemptStatus(attempt.id, {
        status: "completed",
        checkout_id: details.checkoutId || attempt.checkout_id,
        receipt_url: details.receiptUrl || attempt.receipt_url,
        payment_method: details.paymentMethod || attempt.payment_method,
        raw_response: mergeAttemptRawResponse(attempt.raw_response, {
            latest_provider_payload: details.payload,
        }),
    })

    const [result] = (data ?? []) as { action: string; order_id: string }[]
    return { action: result?.action || "created" }
}

export async function processRefundedEvent(details: PaymentEventDetails): Promise<PaymentEventProcessingResult> {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)

    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: "refunded",
            checkout_id: details.checkoutId || attempt.checkout_id,
            receipt_url: details.receiptUrl || attempt.receipt_url,
            payment_method: details.paymentMethod || attempt.payment_method,
            raw_response: mergeAttemptRawResponse(attempt.raw_response, {
                latest_provider_payload: details.payload,
            }),
        })
    }

    await markOrderStatus(details.externalId, details.checkoutId, "refunded", details.status, details.receiptUrl, details.transactionId || details.checkoutId)
    return { action: "refunded" }
}

export async function processDisputedEvent(details: PaymentEventDetails): Promise<PaymentEventProcessingResult> {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)

    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: "disputed",
            checkout_id: details.checkoutId || attempt.checkout_id,
            receipt_url: details.receiptUrl || attempt.receipt_url,
            payment_method: details.paymentMethod || attempt.payment_method,
            raw_response: mergeAttemptRawResponse(attempt.raw_response, {
                latest_provider_payload: details.payload,
            }),
        })
    }

    await markOrderStatus(details.externalId, details.checkoutId, "disputed", details.status, details.receiptUrl, details.transactionId || details.checkoutId)
    return { action: "disputed" }
}

export async function processFailedEvent(details: PaymentEventDetails): Promise<PaymentEventProcessingResult> {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)
    const normalizedStatus = normalizeAbacatePayStatus(details.status)

    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: normalizedStatus === "pending" ? "failed" : normalizedStatus,
            checkout_id: details.checkoutId || attempt.checkout_id,
            receipt_url: details.receiptUrl || attempt.receipt_url,
            payment_method: details.paymentMethod || attempt.payment_method,
            raw_response: mergeAttemptRawResponse(attempt.raw_response, {
                latest_provider_payload: details.payload,
            }),
        })
    }

    await markOrderStatus(details.externalId, details.checkoutId, "cancelled", details.status, details.receiptUrl, details.transactionId || details.checkoutId)
    return { action: "failed" }
}

export async function handleCompletedEvent(details: PaymentEventDetails) {
    return toWebhookResponse(await processCompletedEvent(details))
}

export async function handleRefundedEvent(details: PaymentEventDetails) {
    return toWebhookResponse(await processRefundedEvent(details))
}

export async function handleDisputedEvent(details: PaymentEventDetails) {
    return toWebhookResponse(await processDisputedEvent(details))
}

export async function handleFailedEvent(details: PaymentEventDetails) {
    return toWebhookResponse(await processFailedEvent(details))
}
