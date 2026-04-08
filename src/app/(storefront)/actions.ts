'use server'

import { getSiteUrl } from "@/lib/site-url"
import { getStripeClient } from "@/lib/stripe-client"
import { createClient } from "@/lib/supabase/server"
import { parseCheckoutCartItems } from "@/lib/checkout"
import { 
  validateCheckoutItems, 
  getValidatedItems, 
  buildStripeLineItems 
} from "@/lib/stripe-checkout"

export async function createCheckoutSession(cartItems: unknown) {
    try {
        const supabase = await createClient()
        const stripe = getStripeClient()
        const origin = getSiteUrl()
        const normalizedCartItems = parseCheckoutCartItems(cartItems)

        const productIds = [...new Set(normalizedCartItems.map((item) => item.product_id))]
        const variationIds = [...new Set(normalizedCartItems.map((item) => item.variation_id))]

        const { productsById, variationsById } = await validateCheckoutItems(productIds, variationIds)
        const validatedItems = getValidatedItems(normalizedCartItems, productsById, variationsById)
        const lineItems = buildStripeLineItems(validatedItems)

        const { data: { user } } = await supabase.auth.getUser()

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'pix'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/carrinho`,
            shipping_address_collection: {
                allowed_countries: ['BR'],
            },
            billing_address_collection: 'required',
            client_reference_id: user?.id,
            customer_email: user?.email ?? undefined,
        })

        if (!session.url) {
            throw new Error('Stripe nao retornou a URL de destino.')
        }

        return { url: session.url }
    } catch (error) {
        console.error('Erro ao gerar Stripe Checkout Session:', error)
        return { error: error instanceof Error ? error.message : 'Falha ao processar pagamento.' }
    }
}
