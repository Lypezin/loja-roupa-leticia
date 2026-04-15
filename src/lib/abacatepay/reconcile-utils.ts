import type { Json } from "@/lib/supabase/database.types"
import { normalizeAbacatePayStatus, type AbacatePayBillingRecord } from "@/lib/abacatepay"
import type { PaymentEventDetails } from "./webhook-utils"
import type { ReconcilePendingSummary } from "./reconcile-types"

export function toJson(value: unknown): Json {
    return JSON.parse(JSON.stringify(value)) as Json
}

export function buildDetailsFromBilling(billing: AbacatePayBillingRecord): PaymentEventDetails {
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

export function createPendingSummary(): ReconcilePendingSummary {
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
