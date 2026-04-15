import 'server-only'
import { findAbacatePayBilling, normalizeAbacatePayStatus, type AbacatePayBillingRecord } from '@/lib/abacatepay'
import { findPaymentAttempt, markAttemptStatus } from './webhook-db'
import {
    processCompletedEvent,
    processDisputedEvent,
    processFailedEvent,
    processRefundedEvent,
    type PaymentEventProcessingResult,
} from './webhook-handlers'
import type { PaymentEventDetails } from './webhook-utils'
import type { Json } from '@/lib/supabase/database.types'

type ReconcileAttemptResult = PaymentEventProcessingResult & {
    status: 'matched' | 'missing_attempt' | 'billing_not_found'
    providerStatus?: string | null
}

function toJson(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Json
}

function buildDetailsFromBilling(billing: AbacatePayBillingRecord): PaymentEventDetails {
    const normalizedStatus = normalizeAbacatePayStatus(billing.status)
    const event = normalizedStatus === 'completed'
        ? 'billing.paid'
        : normalizedStatus === 'refunded'
            ? 'billing.refunded'
            : normalizedStatus === 'disputed'
                ? 'billing.disputed'
                : normalizedStatus === 'failed'
                    ? 'billing.failed'
                    : 'billing.pending'

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

export async function reconcileAbacatePayAttempt(externalId: string, userId: string): Promise<ReconcileAttemptResult> {
    const attempt = await findPaymentAttempt(externalId, null)

    if (!attempt || attempt.user_id !== userId) {
        return { action: 'ignored', status: 'missing_attempt' }
    }

    const billing = await findAbacatePayBilling(attempt.checkout_id, attempt.external_id)

    if (!billing) {
        return { action: 'ignored', status: 'billing_not_found' }
    }

    const normalizedStatus = normalizeAbacatePayStatus(billing.status)
    const details = buildDetailsFromBilling(billing)

    if (normalizedStatus === 'completed') {
        const result = await processCompletedEvent(details)
        return { ...result, status: 'matched', providerStatus: billing.status || null }
    }

    if (normalizedStatus === 'refunded') {
        const result = await processRefundedEvent(details)
        return { ...result, status: 'matched', providerStatus: billing.status || null }
    }

    if (normalizedStatus === 'disputed') {
        const result = await processDisputedEvent(details)
        return { ...result, status: 'matched', providerStatus: billing.status || null }
    }

    if (normalizedStatus === 'failed') {
        const result = await processFailedEvent(details)
        return { ...result, status: 'matched', providerStatus: billing.status || null }
    }

    await markAttemptStatus(attempt.id, {
        status: normalizedStatus,
        checkout_id: billing.id || attempt.checkout_id,
        receipt_url: billing.receiptUrl || attempt.receipt_url,
        payment_method: billing.methods?.length === 1 ? billing.methods[0] || attempt.payment_method : attempt.payment_method,
        raw_response: toJson(billing),
    })

    return { action: 'pending', status: 'matched', providerStatus: billing.status || null }
}
