import Stripe from 'stripe'
import { getStripeClient } from '@/lib/stripe-client'
import type { Json } from '@/lib/supabase/database.types'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

type TrustedCheckoutItem = {
    product_id: string
    variation_id: string
    quantity: number
    unit_price: number
}

type FinalizeCheckoutOrderResult = {
    order_id: string
    action: 'created' | 'duplicate' | 'recovered'
}

const REFUNDABLE_CHECKOUT_CONFLICT_CODES = new Set([
    'CHECKOUT_ITEM_INVALID',
    'CHECKOUT_ITEMS_INVALID',
    'CHECKOUT_STOCK_CONFLICT',
])

function normalizeShippingAddress(address: Stripe.Address | null | undefined): Json | null {
    if (!address) {
        return null
    }

    return {
        city: address.city,
        country: address.country,
        line1: address.line1,
        line2: address.line2,
        postal_code: address.postal_code,
        state: address.state,
    }
}

function getLineItemProduct(lineItem: Stripe.LineItem) {
    const product = lineItem.price?.product

    if (!product || typeof product === 'string' || ('deleted' in product && product.deleted)) {
        throw new Error(`Line item ${lineItem.id} sem produto expandido confiavel.`)
    }

    return product
}

async function getTrustedCheckoutItems(sessionId: string) {
    const stripe = getStripeClient()
    const { data: lineItems } = await stripe.checkout.sessions.listLineItems(sessionId, {
        expand: ['data.price.product'],
    })

    if (!lineItems.length) {
        throw new Error(`Sessao ${sessionId} sem line items.`)
    }

    return lineItems.map((lineItem): TrustedCheckoutItem => {
        const product = getLineItemProduct(lineItem)
        const productId = product.metadata.product_id
        const variationId = product.metadata.variation_id
        const quantity = lineItem.quantity ?? 0
        const lineAmount = typeof lineItem.amount_subtotal === 'number'
            ? lineItem.amount_subtotal
            : lineItem.amount_total

        if (!productId || !variationId) {
            throw new Error(`Line item ${lineItem.id} sem metadados confiaveis de produto.`)
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error(`Quantidade invalida no line item ${lineItem.id}.`)
        }

        if (typeof lineAmount !== 'number') {
            throw new Error(`Line item ${lineItem.id} sem valor confiavel.`)
        }

        return {
            product_id: productId,
            variation_id: variationId,
            quantity,
            unit_price: Number((lineAmount / quantity / 100).toFixed(2)),
        }
    })
}

function getCheckoutConflictCode(message: string) {
    return message.split(':', 1)[0]?.trim() || ''
}

function isRefundableCheckoutConflict(message: string) {
    return REFUNDABLE_CHECKOUT_CONFLICT_CODES.has(getCheckoutConflictCode(message))
}

async function refundConflictedSessionPayment(session: Stripe.Checkout.Session, message: string) {
    if (!session.id) {
        throw new Error('Sessao Stripe sem identificador para reembolso automatico.')
    }

    if (typeof session.payment_intent !== 'string' || session.payment_intent.length === 0) {
        throw new Error(`Nao foi possivel reembolsar a sessao ${session.id}: payment_intent ausente.`)
    }

    const stripe = getStripeClient()
    const metadataMessage = message.length > 400 ? `${message.slice(0, 397)}...` : message

    await stripe.refunds.create(
        {
            payment_intent: session.payment_intent,
            metadata: {
                checkout_session_id: session.id,
                conflict_code: getCheckoutConflictCode(message) || 'UNKNOWN',
                origin: 'stripe-webhook',
                reason: metadataMessage,
            },
        },
        {
            idempotencyKey: `checkout-conflict-refund:${session.id}`,
        }
    )

    console.warn(`Sessao ${session.id} reembolsada automaticamente por conflito permanente: ${message}`)
}

async function finalizeTrustedOrder(
    session: Stripe.Checkout.Session,
    trustedItems: TrustedCheckoutItem[],
    totalAmount: number,
    userId: string | null
) {
    if (!session.id) {
        throw new Error('Sessao do checkout sem identificador.')
    }

    const supabaseAdmin = createServiceRoleClient('stripe-webhook.finalizeTrustedOrder')
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null

    const { data, error } = await supabaseAdmin.rpc('finalize_checkout_order', {
        p_customer_email: session.customer_details?.email || session.customer_email || null,
        p_customer_name: session.customer_details?.name || null,
        p_items: trustedItems,
        p_payment_intent_id: paymentIntentId,
        p_shipping_address: normalizeShippingAddress(
            session.collected_information?.shipping_details?.address || session.customer_details?.address
        ),
        p_stripe_session_id: session.id,
        p_total_amount: totalAmount,
        p_user_id: userId,
    })

    if (error) {
        throw new Error(error.message)
    }

    const [result] = (data ?? []) as FinalizeCheckoutOrderResult[]

    if (!result) {
        throw new Error(`Finalizacao do pedido ${session.id} retornou vazia.`)
    }

    return result
}

async function markOrderAsRefunded(charge: Stripe.Charge) {
    const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null

    if (!paymentIntentId) {
        console.log(`Charge ${charge.id} reembolsada sem payment_intent vinculado.`)
        return
    }

    const supabaseAdmin = createServiceRoleClient('stripe-webhook.markOrderAsRefunded')
    const { data: refundedOrder, error } = await supabaseAdmin
        .from('orders')
        .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
        })
        .eq('stripe_payment_intent_id', paymentIntentId)
        .select('id')
        .maybeSingle()

    if (error) {
        throw new Error(`Erro ao sincronizar reembolso ${charge.id}: ${error.message}`)
    }

    if (!refundedOrder) {
        console.log(`Nenhum pedido encontrado para o payment_intent ${paymentIntentId} apos charge.refunded.`)
        return
    }

    console.log(`Pedido ${refundedOrder.id} marcado como reembolsado via Stripe.`)
}

async function persistPaidOrder(session: Stripe.Checkout.Session) {
    if (!session.id) {
        throw new Error('Sessao do checkout sem identificador.')
    }

    if (session.payment_status !== 'paid') {
        console.log(`Pagamento ainda nao confirmado para a sessao ${session.id}.`)
        return NextResponse.json({ received: true, pending: true }, { status: 200 })
    }

    const trustedItems = await getTrustedCheckoutItems(session.id)
    const userId = typeof session.client_reference_id === 'string' ? session.client_reference_id : null
    const totalAmount = typeof session.amount_total === 'number'
        ? session.amount_total / 100
        : trustedItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0)

    try {
        const result = await finalizeTrustedOrder(session, trustedItems, totalAmount, userId)

        if (result.action === 'duplicate') {
            console.log(`Pedido ja existe para session ${session.id}. Ignorando duplicata.`)
            return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
        }

        console.log(`Pedido ${result.order_id} finalizado com acao ${result.action} para session ${session.id}.`)
        return NextResponse.json({ received: true, action: result.action }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno ao finalizar pedido.'

        if (isRefundableCheckoutConflict(message)) {
            await refundConflictedSessionPayment(session, message)
            return NextResponse.json(
                {
                    received: true,
                    refunded: true,
                    reason: getCheckoutConflictCode(message),
                },
                { status: 200 }
            )
        }

        throw error
    }
}

export async function POST(req: Request) {
    const body = await req.text()
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!endpointSecret || !signature) {
        console.error('Configuracao do webhook Stripe incompleta.')
        return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
        const stripe = getStripeClient()
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Webhook signature verification failed: ${message}`)
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded': {
                const session = event.data.object as Stripe.Checkout.Session
                return await persistPaidOrder(session)
            }

            case 'checkout.session.async_payment_failed': {
                const failedSession = event.data.object as Stripe.Checkout.Session
                console.log(`Pagamento assincrono falhou para a sessao ${failedSession.id}`)
                break
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge
                await markOrderAsRefunded(charge)
                break
            }

            default:
                console.log(`Evento ignorado: ${event.type}`)
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno ao processar webhook.'
        console.error('Erro ao processar webhook Stripe:', message)
        return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
