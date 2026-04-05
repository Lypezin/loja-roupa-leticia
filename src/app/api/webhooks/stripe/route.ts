import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { parseOrderMetadataItems } from '@/lib/checkout'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

function createSupabaseAdminClient() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY ausente.')
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL ausente.')
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
}

async function persistPaidOrder(session: Stripe.Checkout.Session) {
    if (!session.id) {
        throw new Error('Sessao do checkout sem identificador.')
    }

    if (session.payment_status !== 'paid') {
        console.log(`Pagamento ainda nao confirmado para a sessao ${session.id}.`)
        return NextResponse.json({ received: true, pending: true }, { status: 200 })
    }

    if (!session.metadata?.cartDetails) {
        throw new Error(`Sessao ${session.id} sem cartDetails nos metadados.`)
    }

    const supabaseAdmin = createSupabaseAdminClient()

    const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle()

    if (existingOrder) {
        console.log(`Pedido ja existe para session ${session.id}. Ignorando duplicata.`)
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
    }

    const metadataItems = parseOrderMetadataItems(JSON.parse(session.metadata.cartDetails))
    const userId = typeof session.client_reference_id === 'string' ? session.client_reference_id : null
    const totalAmount = typeof session.amount_total === 'number' ? session.amount_total / 100 : 0

    const { data: insertedOrder, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
            stripe_session_id: session.id,
            user_id: userId,
            total_amount: totalAmount,
            status: 'paid',
            customer_email: session.customer_details?.email || session.customer_email,
            customer_name: session.customer_details?.name,
            shipping_address: session.collected_information?.shipping_details?.address || session.customer_details?.address,
        })
        .select('id')
        .single()

    if (orderError) {
        throw new Error(`Erro ao salvar pedido: ${orderError.message}`)
    }

    const orderItemsToInsert = metadataItems.map((item) => ({
        order_id: insertedOrder.id,
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        price: item.unit_price,
    }))

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsToInsert)

    if (itemsError) {
        throw new Error(`Erro ao registrar itens do pedido: ${itemsError.message}`)
    }

    for (const item of metadataItems) {
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
