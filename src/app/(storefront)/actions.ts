'use server'

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function createCheckoutSession(cartItems: any[]) {
    try {
        const supabase = await createClient()
        const headersList = await headers()
        const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        // Extract product IDs
        const productIds = cartItems.map(item => item.product_id)

        // Fetch corresponding Stripe Price IDs from Supabase
        const { data: products } = await supabase
            .from('products')
            .select('id, stripe_price_id, name, base_price')
            .in('id', productIds)

        if (!products || products.length === 0) {
            throw new Error('Falha ao buscar detalhes do produto no banco de dados.')
        }

        const lineItems = cartItems.map((cartItem) => {
            const productInfo = products.find(p => p.id === cartItem.product_id)
            
            if (!productInfo) {
                throw new Error(`Produto ${cartItem.product_name} não encontrado no banco de dados.`)
            }

            // Usamos o Price ID da Stripe se existir. 
            // Porém, o Price nativo não mostra a "Cor" nem "Tamanho" pro usuário na nota final.
            // A forma garantida de mostrar variação pro cliente na tela da API é usar 'price_data'.
            // Mas para auditoria interna, a Stripe recomenda amarrar ao ID do produto.
            
            return {
                price_data: {
                    currency: 'brl',
                    unit_amount: Math.round(cartItem.price * 100),
                    product_data: {
                        name: `${cartItem.product_name} ${cartItem.size ? `(${cartItem.size})` : ''}`,
                        description: cartItem.color ? `Cor: ${cartItem.color}` : undefined,
                        // Para conectar com nossos relatórios do Stripe no futuro caso precise, vinculamos aqui:
                        metadata: {
                            product_id: cartItem.product_id,
                            variation_id: cartItem.variation_id
                        }
                    }
                },
                quantity: cartItem.quantity,
            }
        })

        // Metadados são perfeitos pra sabermos no Webhook *exatamente* o que baixar do estoque do banco
        const orderMetadata = {
            cartDetails: JSON.stringify(cartItems.map(i => ({ 
                id: i.product_id, 
                variation: i.variation_id, 
                q: i.quantity,
                p: i.price
            })))
        }

        const { data: { user } } = await supabase.auth.getUser()

        // Criar a Sessão na Stripe
        const sessionParams: any = {
            payment_method_types: ['card', 'boleto'], 
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/sucesso`,
            cancel_url: `${origin}/carrinho`,
            metadata: orderMetadata
        }

        if (user) {
            sessionParams.client_reference_id = user.id
        }

        const session = await stripe.checkout.sessions.create(sessionParams)

        if (!session.url) {
            throw new Error('Stripe não retornou a URL de destino.')
        }

        return { url: session.url }

    } catch (error: any) {
        console.error('Erro ao gerar Stripe Checkout Session:', error)
        return { error: error.message || 'Falha ao processar pagamento.' }
    }
}
