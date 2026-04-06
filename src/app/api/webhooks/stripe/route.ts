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

async function persistPaidOrder(session: Stripe.Checkout.Session) {
    if (!session.id) {
        throw new Error('Sessao do checkout sem identificador.')
    }

    if (session.payment_status !== 'paid') {
        console.log(`Pagamento ainda nao confirmado para a sessao ${session.id}.`)
        return NextResponse.json({ received: true, pending: true }, { status: 200 })
    }

    const supabaseAdmin = createServiceRoleClient('stripe-webhook.persistPaidOrder')

    const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle()

    if (existingOrder) {
        console.log(`Pedido ja existe para session ${session.id}. Ignorando duplicata.`)
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
    }

    const trustedItems = await getTrustedCheckoutItems(session.id)
    const userId = typeof session.client_reference_id === 'string' ? session.client_reference_id : null
    const totalAmount = typeof session.amount_total === 'number'
        ? session.amount_total / 100
        : trustedItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0)

    const productIds = [...new Set(trustedItems.map((item) => item.product_id))]
    const variationIds = [...new Set(trustedItems.map((item) => item.variation_id))]

    const [
        { data: products, error: productsError },
        { data: variations, error: variationsError },
    ] = await Promise.all([
        supabaseAdmin
            .from('products')
            .select('id')
            .in('id', productIds),
        supabaseAdmin
            .from('product_variations')
            .select('id, product_id')
            .in('id', variationIds),
    ])

    if (productsError) {
        throw new Error(`Erro ao carregar produtos confiaveis: ${productsError.message}`)
    }

    if (variationsError) {
        throw new Error(`Erro ao carregar variacoes confiaveis: ${variationsError.message}`)
    }

    const existingProductIds = new Set((products ?? []).map((product) => product.id))
    const existingVariations = new Map((variations ?? []).map((variation) => [variation.id, variation]))

    const { data: insertedOrder, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
            stripe_session_id: session.id,
            user_id: userId,
            total_amount: totalAmount,
            status: 'paid',
            customer_email: session.customer_details?.email || session.customer_email,
            customer_name: session.customer_details?.name,
            shipping_address: normalizeShippingAddress(
                session.collected_information?.shipping_details?.address || session.customer_details?.address
            ),
        })
        .select('id')
        .single()

    if (orderError) {
        throw new Error(`Erro ao salvar pedido: ${orderError.message}`)
    }

    const orderItemsToInsert = trustedItems.map((item) => {
        const variation = existingVariations.get(item.variation_id)
        const productId = existingProductIds.has(item.product_id) ? item.product_id : null
        const variationId = variation?.product_id === item.product_id ? item.variation_id : null

        return {
            order_id: insertedOrder.id,
            product_id: productId,
            variation_id: variationId,
            quantity: item.quantity,
            price: item.unit_price,
        }
    })

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsToInsert)

    if (itemsError) {
        throw new Error(`Erro ao registrar itens do pedido: ${itemsError.message}`)
    }

    for (const item of orderItemsToInsert) {
        if (!item.variation_id) {
            console.error(`Variacao indisponivel para baixa de estoque no pedido ${insertedOrder.id}.`)
            continue
        }

        const { data: stockUpdated, error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
            p_variation_id: item.variation_id,
            p_quantity: item.quantity,
        })

        if (stockError) {
            console.error(`Erro ao descontar estoque da variacao ${item.variation_id}:`, stockError.message)
            continue
        }

        if (stockUpdated !== true) {
            console.error(`Sem estoque suficiente para a variacao ${item.variation_id} no pedido ${insertedOrder.id}.`)
        }
    }

    return NextResponse.json({ received: true }, { status: 200 })
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
                console.log(`Pagamento reembolsado: ${charge.id}`)
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
