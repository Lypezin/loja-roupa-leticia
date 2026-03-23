import Stripe from 'stripe'

// Certifique-se de configurar essa chave no seu .env.local e na Vercel
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummyKeyParaEvitarCrash'

export const stripe = new Stripe(stripeSecretKey, {
    // Definimos a versão mais recente da API estável baseada na tipagem instalada
    apiVersion: '2026-02-25.clover', 
    appInfo: {
        name: 'Fashion Store',
        version: '0.1.0'
    }
})
