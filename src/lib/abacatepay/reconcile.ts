import "server-only"
import {
    findAbacatePayBilling,
    listAbacatePayBillings,
    normalizeAbacatePayStatus,
    type AbacatePayBillingRecord,
} from "@/lib/abacatepay"
import type { Database, Json } from "@/lib/supabase/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { findPaymentAttempt, markAttemptStatus } from "./webhook-db"
import {
    processCompletedEvent,
    processDisputedEvent,
    processFailedEvent,
    processRefundedEvent,
    type PaymentEventProcessingResult,
} from "./webhook-handlers"
import type { PaymentEventDetails } from "./webhook-utils"

type PaymentAttemptRow = Database["public"]["Tables"]["payment_attempts"]["Row"]

type NormalizedAttemptStatus = "completed" | "refunded" | "disputed" | "failed" | "pending"

type ReconcileAttemptResult = PaymentEventProcessingResult & {
    status: "matched" | "missing_attempt" | "billing_not_found"
    providerStatus?: string | null
    normalizedStatus?: NormalizedAttemptStatus
}

type ReconcilePendingOptions = {
    limit?: number
    minAgeMs?: number
    userId?: string
}

export type ReconcilePendingSummary = {
    checked: number
    matched: number
    completed: number
    refunded: number
    disputed: number
    failed: number
    pending: number
    billingNotFound: number
    ignored: number
    errors: string[]
}

function toJson(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Json
}

function buildDetailsFromBilling(billing: AbacatePayBillingRecord): PaymentEventDetails {
    const normalizedStatus = normalizeAbacatePayStatus(billing.status)
    const event = normalizedStatus === "completed"
        ? "billing.paid"
        : normalizedStatus === "refunded"
            ? "billing.refunded"
            : normalizedStatus === "disputed"
                ? "billing.disputed"
                : normalizedStatus === "failed"
                    ? "billing.failed"
                    : "billing.pending"

    return {
        event,
        checkoutId: billing.id || null,
        externalId: billing.externalId || null,
        transactionId: billing.id || null,
        status: billing.status || null,
        receiptUrl: billing.receiptUrl || null,
        customerEmail: billing.customer?.metadata?.email || null,
        customerName: billing.customer?.metadata?.name || null,
        paymentMethod: billing.methods?.length === 1 ? billing.methods[0] || null : null,
        payload: toJson(billing),
    }
}

async function reconcileAttemptWithBilling(
    attempt: PaymentAttemptRow,
    billing: AbacatePayBillingRecord,
): Promise<ReconcileAttemptResult> {
    const normalizedStatus = normalizeAbacatePayStatus(billing.status) as NormalizedAttemptStatus
    const details = buildDetailsFromBilling(billing)

    if (normalizedStatus === "completed") {
        const result = await processCompletedEvent(details)
        return { ...result, status: "matched", providerStatus: billing.status || null, normalizedStatus }
    }

    if (normalizedStatus === "refunded") {
        const result = await processRefundedEvent(details)
        return { ...result, status: "matched", providerStatus: billing.status || null, normalizedStatus }
    }

    if (normalizedStatus === "disputed") {
        const result = await processDisputedEvent(details)
        return { ...result, status: "matched", providerStatus: billing.status || null, normalizedStatus }
    }

    if (normalizedStatus === "failed") {
        const result = await processFailedEvent(details)
        return { ...result, status: "matched", providerStatus: billing.status || null, normalizedStatus }
    }

    await markAttemptStatus(attempt.id, {
        status: normalizedStatus,
        checkout_id: billing.id || attempt.checkout_id,
        receipt_url: billing.receiptUrl || attempt.receipt_url,
        payment_method: billing.methods?.length === 1 ? billing.methods[0] || attempt.payment_method : attempt.payment_method,
        raw_response: toJson(billing),
    })

    return { action: "pending", status: "matched", providerStatus: billing.status || null, normalizedStatus }
}

export async function reconcileAbacatePayAttempt(externalId: string, userId: string): Promise<ReconcileAttemptResult> {
    const attempt = await findPaymentAttempt(externalId, null)

    if (!attempt || attempt.user_id !== userId) {
        return { action: "ignored", status: "missing_attempt" }
    }

    const billing = await findAbacatePayBilling(attempt.checkout_id, attempt.external_id)

    if (!billing) {
        return { action: "ignored", status: "billing_not_found" }
    }

    return reconcileAttemptWithBilling(attempt, billing)
}

function createPendingSummary(): ReconcilePendingSummary {
    return {
        checked: 0,
        matched: 0,
        completed: 0,
        refunded: 0,
        disputed: 0,
        failed: 0,
        pending: 0,
        billingNotFound: 0,
        ignored: 0,
        errors: [],
    }
}

export async function reconcilePendingAbacatePayAttempts({
    limit = 20,
    minAgeMs = 30_000,
    userId,
}: ReconcilePendingOptions = {}): Promise<ReconcilePendingSummary> {
    const summary = createPendingSummary()
    const supabase = createServiceRoleClient("abacatepay-reconcile.pending-attempts")
    const thresholdIso = new Date(Date.now() - minAgeMs).toISOString()

    let query = supabase
        .from("payment_attempts")
        .select("*")
        .eq("provider", "abacatepay")
        .in("status", ["pending", "creating"])
        .lt("created_at", thresholdIso)
        .order("created_at", { ascending: true })
        .limit(limit)

    if (userId) {
        query = query.eq("user_id", userId)
    }

    const { data: attempts, error } = await query

    if (error) {
        throw new Error(`Falha ao listar tentativas pendentes: ${error.message}`)
    }

    if (!attempts?.length) {
        return summary
    }

    const billings = await listAbacatePayBillings()
    const billingByExternalId = new Map<string, AbacatePayBillingRecord>()
    const billingByCheckoutId = new Map<string, AbacatePayBillingRecord>()

    for (const billing of billings) {
        if (billing.externalId) {
            billingByExternalId.set(billing.externalId, billing)
        }

        if (billing.id) {
            billingByCheckoutId.set(billing.id, billing)
        }
    }

    for (const attempt of attempts) {
        summary.checked += 1

        const billing = (attempt.external_id ? billingByExternalId.get(attempt.external_id) : null)
            || (attempt.checkout_id ? billingByCheckoutId.get(attempt.checkout_id) : null)

        if (!billing) {
            summary.billingNotFound += 1
            continue
        }

        try {
            const result = await reconcileAttemptWithBilling(attempt, billing)

            if (result.status !== "matched") {
                summary.ignored += 1
                continue
            }

            summary.matched += 1

            switch (result.normalizedStatus) {
                case "completed":
                    summary.completed += 1
                    break
                case "refunded":
                    summary.refunded += 1
                    break
                case "disputed":
                    summary.disputed += 1
                    break
                case "failed":
                    summary.failed += 1
                    break
                default:
                    summary.pending += 1
                    break
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido ao reconciliar tentativa."
            summary.errors.push(`${attempt.external_id || attempt.id}: ${message}`)
        }
    }

    return summary
}
