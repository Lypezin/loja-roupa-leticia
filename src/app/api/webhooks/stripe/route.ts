import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    const headersList = await headers()
    const signature = headersList.get('stripe-signature') as string

    // 1. Validar Assinatura do Evento
    let event
    if (!endpointSecret) {
        console.error("⛔ CRÍTICO: STRIPE_WEBHOOK_SECRET ausente. Abortando operação para segurança do sistema.");
        return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 })
    }

    try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    // 2. Tratar Eventos Específicos da Stripe
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as any

            console.log(`✅ Pagamento efetuado com sucesso (Checkout ID: ${session.id})`)

            // Iniciar Supabase Admin (Service Role para ignorar RLS)
            const { createClient } = await import('@supabase/supabase-js')
            if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
                console.error("⛔ CRÍTICO: SUPABASE_SERVICE_ROLE_KEY ausente. Não é seguro continuar a gerir pedidos com token anônimo.")
                return NextResponse.json({ error: 'Missing admin configuration' }, { status: 500 })
            }
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )

            // ========== PROTEÇÃO CONTRA DUPLICIDADE ==========
            // Se a Stripe reenviar o evento, não criar pedido duplicado
            const { data: existingOrder } = await supabaseAdmin
                .from('orders')
                .select('id')
                .eq('stripe_session_id', session.id)
                .maybeSingle()

            if (existingOrder) {
                console.log(`⚠️ Pedido já existe para session ${session.id}. Ignorando duplicata.`)
                return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
            }

            // Descobrir o user_id (via client_reference_id enviado no checkout)
            const userId = session.client_reference_id || null

            // ========== INSERIR PEDIDO ==========
            const { data: insertedOrder, error: orderError } = await supabaseAdmin.from('orders').insert({
                stripe_session_id: session.id,
                user_id: userId,
                total_amount: session.amount_total / 100,
                status: 'paid',
                customer_email: session.customer_details?.email,
                customer_name: session.customer_details?.name,
                shipping_address: session.shipping_details?.address || session.customer_details?.address,
            }).select('id').single()

            if (orderError) {
                console.error("❌ Erro ao salvar Pedido:", orderError.message)
                return NextResponse.json({ error: 'Database Order error' }, { status: 500 })
            }

            console.log(`✅ Pedido cadastrado com ID: ${insertedOrder.id}`)

            // ========== INSERIR ITENS + DESCONTAR ESTOQUE ==========
            if (session.metadata?.cartDetails) {
                const items = JSON.parse(session.metadata.cartDetails)
                
                const orderItemsToInsert = items.map((item: any) => ({
                    order_id: insertedOrder.id,
                    product_id: item.id,
                    variation_id: item.variation || null,
                    quantity: item.q,
                    price: item.p || 0
                }))

                const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsToInsert)
                
                if (itemsError) {
                    console.error("❌ Erro ao registrar Itens:", itemsError.message)
                } else {
                    console.log(`✅ ${items.length} itens registrados!`)
                }

                // Descontar estoque automaticamente
                for (const item of items) {
                    if (item.variation) {
                        const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
                            p_variation_id: item.variation,
                            p_quantity: item.q
                        })
                        if (stockError) {
                            console.error(`⚠️ Erro ao descontar estoque da variação ${item.variation}:`, stockError.message)
                        }
                    }
                }
            }
            break
        }
            
        case 'charge.refunded': {
            const charge = event.data.object as any
            console.log(`⚠️ Pagamento reembolsado: ${charge.id}`)
            break
        }

        default:
            console.log(`🤷‍♂️ Evento ignorado: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
