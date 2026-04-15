'use server'

import { quoteShippingOptionsForCart } from "@/lib/store-shipping"

function normalizePostalCode(value: string) {
    return value.replace(/\D/g, "").slice(0, 8)
}

async function isUnknownPostalCode(destinationPostalCode: string) {
    const normalizedPostalCode = normalizePostalCode(destinationPostalCode)

    if (normalizedPostalCode.length !== 8) {
        return false
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${normalizedPostalCode}/json/`, {
            cache: "no-store",
        })

        if (!response.ok) {
            return false
        }

        const payload = await response.json().catch(() => null) as { erro?: boolean | string } | null
        return payload?.erro === true || payload?.erro === "true"
    } catch {
        return false
    }
}

function mapShippingErrorMessage(message: string, destinationPostalCode: string) {
    const normalizedMessage = message.trim().toLowerCase()

    if (
        normalizedMessage === "the given data was invalid."
        || normalizedMessage.includes("postal_code")
        || normalizedMessage.includes("postal code")
    ) {
        return isUnknownPostalCode(destinationPostalCode).then((unknownPostalCode) => {
            if (unknownPostalCode) {
                return "O CEP informado nao foi encontrado. Revise os numeros e tente novamente."
            }

            return "Nao foi possivel calcular frete para esse CEP agora. Confira o CEP e tente novamente em instantes."
        })
    }

    return Promise.resolve(message)
}

export async function quoteShippingOptions(cartItems: unknown, destinationPostalCode: string) {
    try {
        const options = await quoteShippingOptionsForCart(cartItems, destinationPostalCode)
        return { options }
    } catch (error) {
        const rawMessage = error instanceof Error ? error.message : "Nao foi possivel calcular o frete."
        const errorMessage = await mapShippingErrorMessage(rawMessage, destinationPostalCode)

        return {
            error: errorMessage,
        }
    }
}
