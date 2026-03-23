import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/response'

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
            
            // Aqui recuperamos exatamente o carrinho do cliente
            if (session.metadata?.cartDetails) {
                const items = JSON.parse(session.metadata.cartDetails)
                console.log('Itens Comprados (Preparar para salvar no BD/Estoque):', items)
            }

            // A FAZER NO FUTURO (Opcional):
            // 1. if(session.payment_status === 'paid') ... inserir pedido na tabela 'orders' do Supabase
            // 2. Disparar email de recibo

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
