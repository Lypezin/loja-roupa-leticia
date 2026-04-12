import type { ShippingQuoteOption } from "@/types/shipping"

export function formatPostalCodeInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8)

    if (digits.length <= 5) {
        return digits
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function getDeliveryLabel(quote: ShippingQuoteOption) {
    const totalDays = quote.delivery_days

    if (totalDays <= 0) {
        return "Prazo sob consulta"
    }

    if (totalDays === 1) {
        return "1 dia útil"
    }

    return `${totalDays} dias úteis`
}
