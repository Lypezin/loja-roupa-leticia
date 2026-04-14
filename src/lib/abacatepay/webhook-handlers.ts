import { NextResponse } from 'next/server'
import { normalizeAbacatePayStatus } from '@/lib/abacatepay'
import type { PaymentEventDetails } from './webhook-utils'
import { findPaymentAttempt, markAttemptStatus, markOrderStatus, finalizePaymentOrder } from './webhook-db'
import type { Json } from '@/lib/supabase/database.types'

export async function handleCompletedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)

    if (!attempt) {
        console.error('Tentativa de pagamento nao encontrada para webhook da AbacatePay.', details)
        return NextResponse.json({ received: true, ignored: 'missing_attempt' }, { status: 200 })
    }

    const data = await finalizePaymentOrder(
        details.checkoutId || '',
        details.externalId || attempt.external_id,
        attempt.user_id || '',
        attempt.total_amount,
        details.customerEmail || attempt.customer_email || '',
        details.customerName || attempt.customer_name || '',
        (attempt.shipping_address ?? null) as Json,
        attempt.trusted_items,
        details.paymentMethod || '',
        details.receiptUrl || attempt.receipt_url || '',
        details.status || attempt.status || '',
        details.transactionId || details.checkoutId || attempt.checkout_id || '',
    )

    await markAttemptStatus(attempt.id, {
        status: 'completed',
        checkout_id: details.checkoutId,
        receipt_url: details.receiptUrl || attempt.receipt_url,
        payment_method: details.paymentMethod || attempt.payment_method,
        raw_response: details.payload,
    })

    const [result] = (data ?? []) as { action: string; order_id: string }[]
    return NextResponse.json({ received: true, action: result?.action || 'created' }, { status: 200 })
}

export async function handleRefundedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)
    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: 'refunded',
            checkout_id: details.checkoutId,
            receipt_url: details.receiptUrl || attempt.receipt_url,
            payment_method: details.paymentMethod || attempt.payment_method,
            raw_response: details.payload,
        })
    }
    await markOrderStatus(details.externalId, details.checkoutId, 'refunded', details.status, details.receiptUrl, details.transactionId || details.checkoutId)
    return NextResponse.json({ received: true, action: 'refunded' }, { status: 200 })
}

export async function handleDisputedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)
    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: 'disputed',
            checkout_id: details.checkoutId,
            receipt_url: details.receiptUrl || attempt.receipt_url,
            payment_method: details.paymentMethod || attempt.payment_method,
            raw_response: details.payload,
        })
    }
    await markOrderStatus(details.externalId, details.checkoutId, 'disputed', details.status, details.receiptUrl, details.transactionId || details.checkoutId)
    return NextResponse.json({ received: true, action: 'disputed' }, { status: 200 })
}

export async function handleFailedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)
    const normalizedStatus = normalizeAbacatePayStatus(details.status)

    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: normalizedStatus === 'pending' ? 'failed' : normalizedStatus,
            checkout_id: details.checkoutId,
            receipt_url: details.receiptUrl || attempt.receipt_url,
            payment_method: details.paymentMethod || attempt.payment_method,
            raw_response: details.payload,
        })
    }
    await markOrderStatus(details.externalId, details.checkoutId, 'cancelled', details.status, details.receiptUrl, details.transactionId || details.checkoutId)
    return NextResponse.json({ received: true, action: 'failed' }, { status: 200 })
}
