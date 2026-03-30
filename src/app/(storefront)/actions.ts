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

            // OBRIGATÓRIO (SEGURANÇA): Utilizar EXCLUSIVAMENTE o preço guardado no BD (base_price).
            // NUNCA confiar no valor (cartItem.price) enviado do Front-End (Price Tampering).
            const securePrice = productInfo.base_price;
            
            return {
                price_data: {
                    currency: 'brl',
                    unit_amount: Math.round(securePrice * 100),
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
            cartDetails: JSON.stringify(cartItems.map(i => {
                const pInfo = products.find(p => p.id === i.product_id)
                return { 
                    id: i.product_id, 
                    variation: i.variation_id, 
                    q: i.quantity,
                    p: pInfo?.base_price || 0 // Usa banco como fonte da verdade
                }
            }))
        }

        const { data: { user } } = await supabase.auth.getUser()

        // Criar a Sessão na Stripe
        const sessionParams: any = {
            payment_method_types: ['card', 'boleto'], 
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/carrinho`,
            metadata: orderMetadata,
            // Coleta de endereço de entrega (a Stripe pergunta para o cliente)
            shipping_address_collection: {
                allowed_countries: ['BR'],
            },
            // Exigir endereço de cobrança também
            billing_address_collection: 'required',
        }

        if (user) {
            sessionParams.client_reference_id = user.id
            sessionParams.customer_email = user.email
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
