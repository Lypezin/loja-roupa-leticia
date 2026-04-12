import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { verifyAbacatePaySignature } from '@/lib/abacatepay'
import { extractPaymentEventDetails } from '@/lib/abacatepay/webhook-utils'
import {
    handleCompletedEvent,
    handleRefundedEvent,
    handleDisputedEvent,
    handleFailedEvent
} from '@/lib/abacatepay/webhook-handlers'

function matchesConfiguredSecret(requestSecret: string | null, configuredSecret: string) {
    if (!requestSecret) {
        return false
    }

    const expectedBuffer = Buffer.from(configuredSecret)
    const receivedBuffer = Buffer.from(requestSecret)

    return expectedBuffer.length === receivedBuffer.length
        && timingSafeEqual(expectedBuffer, receivedBuffer)
}

export async function POST(req: Request) {
    const configuredSecret = process.env.ABACATEPAY_WEBHOOK_SECRET?.trim()
    const requestUrl = new URL(req.url)
    const requestSecret = requestUrl.searchParams.get('webhookSecret')
    const signature = req.headers.get('X-Webhook-Signature')
    const rawBody = await req.text()

    if (!configuredSecret || !matchesConfiguredSecret(requestSecret, configuredSecret)) {
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
