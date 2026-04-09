import type { Json } from '@/lib/supabase/database.types'
import { normalizeAbacatePayStatus, verifyAbacatePaySignature } from '@/lib/abacatepay'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { NextResponse } from 'next/server'

type UnknownRecord = Record<string, unknown>

type PaymentEventDetails = {
    event: string
    checkoutId: string | null
    externalId: string | null
    status: string | null
    receiptUrl: string | null
    customerEmail: string | null
    customerName: string | null
    paymentMethod: string | null
    payload: Json
}

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === 'object' && value !== null
}

function readString(source: UnknownRecord | null | undefined, key: string) {
    if (!source) {
        return null
    }

    const value = source[key]
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

function readStringArray(source: UnknownRecord | null | undefined, key: string) {
    if (!source) {
        return []
    }

    const value = source[key]
    if (!Array.isArray(value)) {
        return []
    }

    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function toJson(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Json
}

function extractPaymentEventDetails(payload: unknown): PaymentEventDetails | null {
    if (!isRecord(payload)) {
        return null
    }

    const event = readString(payload, 'event')
    const data = isRecord(payload.data) ? payload.data : null
    const paymentNode = data && (
        (isRecord(data.checkout) && data.checkout)
        || (isRecord(data.billing) && data.billing)
        || (isRecord(data.transparent) && data.transparent)
        || (isRecord(data.payment) && data.payment)
        || data
    )
    const customerNode = data && isRecord(data.customer) ? data.customer : null
    const payerInformationNode = data && isRecord(data.payerInformation) ? data.payerInformation : null
    const methods = readStringArray(paymentNode, 'methods')

    if (!event || !paymentNode) {
        return null
    }

    return {
        event,
        checkoutId: readString(paymentNode, 'id'),
        externalId: readString(paymentNode, 'externalId'),
        status: readString(paymentNode, 'status'),
        receiptUrl: readString(paymentNode, 'receiptUrl'),
        customerEmail: readString(customerNode, 'email'),
        customerName: readString(customerNode, 'name'),
        paymentMethod: readString(payerInformationNode, 'method') || methods[0] || null,
        payload: toJson(payload),
    }
}

async function findPaymentAttempt(externalId: string | null, checkoutId: string | null) {
    const supabase = createServiceRoleClient('abacatepay-webhook.find-attempt')

    if (externalId) {
        const { data } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('external_id', externalId)
            .maybeSingle()

        if (data) {
            return data
        }
    }

    if (checkoutId) {
        const { data } = await supabase
            .from('payment_attempts')
            .select('*')
            .eq('checkout_id', checkoutId)
            .maybeSingle()

        if (data) {
            return data
        }
    }

    return null
}

async function markAttemptStatus(attemptId: string, values: Record<string, Json | string | null>) {
    const supabase = createServiceRoleClient('abacatepay-webhook.mark-attempt')

    const { error } = await supabase
        .from('payment_attempts')
        .update({
            ...values,
            updated_at: new Date().toISOString(),
        })
        .eq('id', attemptId)

    if (error) {
        throw new Error(`Falha ao atualizar tentativa de pagamento: ${error.message}`)
    }
}

async function markOrderStatus(
    externalId: string | null,
    checkoutId: string | null,
    status: 'refunded' | 'cancelled',
    paymentRawStatus: string | null,
    receiptUrl: string | null
) {
    const supabase = createServiceRoleClient('abacatepay-webhook.mark-order')

    let orderId: string | null = null

    if (externalId) {
        const { data } = await supabase
            .from('orders')
            .select('id')
            .eq('payment_provider', 'abacatepay')
            .eq('payment_external_id', externalId)
            .maybeSingle()

        orderId = data?.id || null
    }

    if (!orderId && checkoutId) {
        const { data } = await supabase
            .from('orders')
            .select('id')
            .eq('payment_provider', 'abacatepay')
            .eq('payment_checkout_id', checkoutId)
            .maybeSingle()

        orderId = data?.id || null
    }

    if (!orderId) {
        return
    }

    const { error } = await supabase
        .from('orders')
        .update({
            status,
            payment_raw_status: paymentRawStatus,
            payment_receipt_url: receiptUrl,
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

    if (error) {
        throw new Error(`Falha ao atualizar pedido: ${error.message}`)
    }
}

async function handleCompletedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)

    if (!attempt) {
        console.error('Tentativa de pagamento nao encontrada para webhook da AbacatePay.', details)
        return NextResponse.json({ received: true, ignored: 'missing_attempt' }, { status: 200 })
    }

    const supabase = createServiceRoleClient('abacatepay-webhook.complete')
    const { data, error } = await supabase.rpc('finalize_payment_order', {
        p_provider: 'abacatepay',
        p_checkout_id: details.checkoutId || '',
        p_external_id: details.externalId || attempt.external_id,
        p_transaction_id: '',
        p_user_id: attempt.user_id || '',
        p_total_amount: attempt.total_amount,
        p_customer_email: details.customerEmail || attempt.customer_email || '',
        p_customer_name: details.customerName || attempt.customer_name || '',
        p_shipping_address: (attempt.shipping_address ?? null) as Json,
        p_items: attempt.trusted_items,
        p_payment_method: details.paymentMethod || '',
        p_payment_receipt_url: details.receiptUrl || '',
        p_payment_raw_status: details.status || '',
    })

    if (error) {
        throw new Error(error.message)
    }

    await markAttemptStatus(attempt.id, {
        status: 'completed',
        checkout_id: details.checkoutId,
        receipt_url: details.receiptUrl,
        payment_method: details.paymentMethod,
        raw_response: details.payload,
    })

    const [result] = (data ?? []) as { action: string; order_id: string }[]
    return NextResponse.json({ received: true, action: result?.action || 'created' }, { status: 200 })
}

async function handleRefundedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)

    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: 'refunded',
            checkout_id: details.checkoutId,
            receipt_url: details.receiptUrl,
            payment_method: details.paymentMethod,
            raw_response: details.payload,
        })
    }

    await markOrderStatus(details.externalId, details.checkoutId, 'refunded', details.status, details.receiptUrl)
    return NextResponse.json({ received: true, action: 'refunded' }, { status: 200 })
}

async function handleDisputedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)

    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: 'disputed',
            checkout_id: details.checkoutId,
            receipt_url: details.receiptUrl,
            payment_method: details.paymentMethod,
            raw_response: details.payload,
        })
    }

    await markOrderStatus(details.externalId, details.checkoutId, 'cancelled', details.status, details.receiptUrl)
    return NextResponse.json({ received: true, action: 'disputed' }, { status: 200 })
}

async function handleFailedEvent(details: PaymentEventDetails) {
    const attempt = await findPaymentAttempt(details.externalId, details.checkoutId)
    const normalizedStatus = normalizeAbacatePayStatus(details.status)

    if (attempt) {
        await markAttemptStatus(attempt.id, {
            status: normalizedStatus === 'pending' ? 'failed' : normalizedStatus,
            checkout_id: details.checkoutId,
            receipt_url: details.receiptUrl,
            payment_method: details.paymentMethod,
            raw_response: details.payload,
        })
    }

    await markOrderStatus(details.externalId, details.checkoutId, 'cancelled', details.status, details.receiptUrl)
    return NextResponse.json({ received: true, action: 'failed' }, { status: 200 })
}

export async function POST(req: Request) {
    const configuredSecret = process.env.ABACATEPAY_WEBHOOK_SECRET?.trim()
    const requestUrl = new URL(req.url)
    const requestSecret = requestUrl.searchParams.get('webhookSecret')
    const signature = req.headers.get('X-Webhook-Signature')
    const rawBody = await req.text()

    if (!configuredSecret || !requestSecret || requestSecret !== configuredSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!signature || !verifyAbacatePaySignature(rawBody, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    let payload: unknown

    try {
        payload = JSON.parse(rawBody)
    } catch {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const details = extractPaymentEventDetails(payload)

    if (!details) {
        return NextResponse.json({ error: 'Unsupported payload' }, { status: 400 })
    }

    try {
        switch (details.event) {
            case 'checkout.completed':
            case 'billing.paid':
                return await handleCompletedEvent(details)

            case 'checkout.refunded':
            case 'billing.refunded':
                return await handleRefundedEvent(details)

            case 'checkout.disputed':
            case 'billing.disputed':
                return await handleDisputedEvent(details)

            case 'checkout.failed':
            case 'checkout.cancelled':
            case 'billing.failed':
            case 'billing.cancelled':
                return await handleFailedEvent(details)

            default:
                return NextResponse.json({ received: true, ignored: details.event }, { status: 200 })
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno ao processar webhook.'
        console.error('Erro ao processar webhook da AbacatePay:', message)
        return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
    }
}
