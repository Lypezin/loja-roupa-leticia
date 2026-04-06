import Stripe from 'stripe'

let cachedStripe: Stripe | null = null

export function getStripeClient() {
    if (cachedStripe) {
        return cachedStripe
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
        throw new Error('STRIPE_SECRET_KEY ausente.')
    }

    cachedStripe = new Stripe(stripeSecretKey, {
        apiVersion: '2026-02-25.clover',
        appInfo: {
            name: 'Fashion Store',
            version: '0.1.0',
        },
    })

    return cachedStripe
}
