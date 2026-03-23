import Stripe from 'stripe'

// Certifique-se de configurar essa chave no seu .env.local e na Vercel
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

export const stripe = new Stripe(stripeSecretKey, {
    // Definimos a versão mais recente da API estável
    apiVersion: '2023-10-16', 
    appInfo: {
        name: 'Fashion Store',
        version: '0.1.0'
    }
})
