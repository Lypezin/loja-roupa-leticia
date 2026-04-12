'use server'

import { quoteShippingOptionsForCart } from "@/lib/store-shipping"

export async function quoteShippingOptions(cartItems: unknown, destinationPostalCode: string) {
    try {
        const options = await quoteShippingOptionsForCart(cartItems, destinationPostalCode)
        return { options }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Não foi possível calcular o frete.",
        }
    }
}
