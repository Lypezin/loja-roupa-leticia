'use server'

import type Stripe from "stripe"
import { getSiteUrl } from "@/lib/site-url"
import { getStripeClient } from "@/lib/stripe-client"
import { createClient } from "@/lib/supabase/server"
import { parseCheckoutCartItems } from "@/lib/checkout"

type ProductRecord = {
    id: string
    name: string
    base_price: number
    is_active: boolean
}

type VariationRecord = {
    id: string
    product_id: string
    size: string | null
    color: string | null
    stock_quantity: number
}

export async function createCheckoutSession(cartItems: unknown) {
    try {
        const supabase = await createClient()
        const stripe = getStripeClient()
        const origin = getSiteUrl()
        const normalizedCartItems = parseCheckoutCartItems(cartItems)

        const productIds = [...new Set(normalizedCartItems.map((item) => item.product_id))]
        const variationIds = [...new Set(normalizedCartItems.map((item) => item.variation_id))]

        const [
            { data: products, error: productsError },
            { data: variations, error: variationsError },
        ] = await Promise.all([
            supabase
                .from('products')
                .select('id, name, base_price, is_active')
                .in('id', productIds)
                .eq('is_active', true),
            supabase
                .from('product_variations')
                .select('id, product_id, size, color, stock_quantity')
                .in('id', variationIds),
        ])

        if (productsError) {
            throw new Error('Falha ao buscar produtos no banco de dados.')
        }

        if (variationsError) {
            throw new Error('Falha ao validar variacoes do carrinho.')
        }

        if (!products || products.length !== productIds.length) {
            throw new Error('Um ou mais produtos do carrinho estao indisponiveis.')
        }

        if (!variations || variations.length !== variationIds.length) {
            throw new Error('Uma ou mais variacoes do carrinho nao existem.')
        }

        const productsById = new Map(products.map((product) => [product.id, product as ProductRecord]))
        const variationsById = new Map(variations.map((variation) => [variation.id, variation as VariationRecord]))

        const validatedItems = normalizedCartItems.map((cartItem) => {
            const productInfo = productsById.get(cartItem.product_id)
            const variationInfo = variationsById.get(cartItem.variation_id)

            if (!productInfo || !productInfo.is_active) {
                throw new Error('Produto indisponivel para checkout.')
            }

            if (!variationInfo || variationInfo.product_id !== productInfo.id) {
                throw new Error(`Variacao invalida para o produto ${productInfo.name}.`)
            }

            if (variationInfo.stock_quantity < cartItem.quantity) {
                throw new Error(`Estoque insuficiente para ${productInfo.name}.`)
            }

            return {
                product_id: productInfo.id,
                product_name: productInfo.name,
                variation_id: variationInfo.id,
                size: variationInfo.size,
                color: variationInfo.color,
                unit_price: productInfo.base_price,
                quantity: cartItem.quantity,
            }
        })

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validatedItems.map((item) => ({
            price_data: {
                currency: 'brl',
                unit_amount: Math.round(item.unit_price * 100),
                product_data: {
                    name: `${item.product_name}${item.size ? ` (${item.size})` : ''}`,
                    description: item.color ? `Cor: ${item.color}` : undefined,
                    metadata: {
                        product_id: item.product_id,
                        variation_id: item.variation_id,
                    },
                },
            },
            quantity: item.quantity,
        }))

        const { data: { user } } = await supabase.auth.getUser()

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card', 'boleto'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/carrinho`,
            shipping_address_collection: {
                allowed_countries: ['BR'],
            },
            billing_address_collection: 'required',
        }

        if (user?.email) {
            sessionParams.client_reference_id = user.id
            sessionParams.customer_email = user.email
        }

        const session = await stripe.checkout.sessions.create(sessionParams)

        if (!session.url) {
            throw new Error('Stripe nao retornou a URL de destino.')
        }

        return { url: session.url }
    } catch (error) {
        console.error('Erro ao gerar Stripe Checkout Session:', error)
        return { error: error instanceof Error ? error.message : 'Falha ao processar pagamento.' }
    }
}
