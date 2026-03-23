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
    if (endpointSecret) {
        try {
            event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
        } catch (err: any) {
            console.error(`⚠️  Webhook signature verification failed: ${err.message}`)
            return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
        }
    } else {
        // Se ainda não tivermos a variável configurada, passamos o evento manualmente durante os testes
        event = JSON.parse(body)
    }

    // 2. Tratar Eventos Específicos da Stripe
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as any

            console.log(`✅ Pagamento efetuado com sucesso (Checkout ID: ${session.id})`)
            console.log(`Valor Total: ${session.amount_total / 100} BRL`)
            
            // 3. Salvar Pedido no Supabase
            // Usamos o @supabase/supabase-js com a SERVICE_ROLE_KEY para ignorar o RLS durante o webhook
            const { createClient } = await import('@supabase/supabase-js')
            
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            // Tentar descobrir o user_id real se ele fez checkout logado
            let userId = session.client_reference_id || null
            if (!userId && session.metadata?.userId) {
                userId = session.metadata.userId
            }

            // Inserir Order (Pedido Principal)
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
                console.error("❌ Erro ao salvar Pedido na tabela 'orders':", orderError.message)
                return NextResponse.json({ error: 'Database Order error' }, { status: 500 })
            }

            console.log(`✅ Pedido cadastrado com ID: ${insertedOrder.id}`)

            // Inserir os Itens do Pedido se baseando no Carrinho
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
                    console.error("❌ Erro ao registrar Itens do Pedido no BD:", itemsError.message)
                } else {
                    console.log(`✅ ${items.length} itens registrados no pedido!`)
                }
            }
            break;
            
        case 'charge.refunded':
            const charge = event.data.object as any
            console.log(`⚠️ Pagamento reembolsado: ${charge.id}`)
            // Atualizar status no banco de dados para "Devolvido"
            break;

        default:
            console.log(`🤷‍♂️ Evento ignorado: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
