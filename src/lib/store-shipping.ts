import { parseCheckoutCartItems } from "@/lib/checkout"
import { normalizePostalCode } from "@/lib/customer-profile"
import { calculateMelhorEnvioShippingQuotes } from "@/lib/melhor-envio"
import { calculateCheckoutTotal, getValidatedItems, validateCheckoutItems } from "@/lib/payment-checkout"
import { createClient } from "@/lib/supabase/server"
import type { CheckoutShippingSelection, ShippingQuoteOption } from "@/types/shipping"

type StoreShippingSettings = {
    shipping_origin_zip: string | null
    processing_days: number | null
    free_shipping_threshold: number | string | null
    support_email: string | null
    store_name: string | null
}

function normalizeFreeShippingThreshold(value: number | string | null) {
    const parsedValue = typeof value === "string" ? Number.parseFloat(value) : value
    return typeof parsedValue === "number" && Number.isFinite(parsedValue) && parsedValue > 0
        ? parsedValue
        : null
}

async function getStoreShippingSettings(): Promise<StoreShippingSettings> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("store_settings")
        .select("shipping_origin_zip, processing_days, free_shipping_threshold, support_email, store_name")
        .limit(1)
        .maybeSingle()

    if (error) {
        throw new Error(`Falha ao carregar configuracoes de frete: ${error.message}`)
    }

    if (!data?.shipping_origin_zip) {
        throw new Error("Configure o CEP de origem do despacho no painel antes de calcular fretes.")
    }

    return data
}

export async function quoteShippingOptionsForCart(cartItems: unknown, destinationPostalCode: string) {
    const normalizedPostalCode = normalizePostalCode(destinationPostalCode)

    if (!normalizedPostalCode) {
        throw new Error("Informe um CEP valido para calcular o frete.")
    }

    const normalizedCartItems = parseCheckoutCartItems(cartItems)
    const productIds = [...new Set(normalizedCartItems.map((item) => item.product_id))]
    const variationIds = [...new Set(normalizedCartItems.map((item) => item.variation_id))]
    const { productsById, variationsById } = await validateCheckoutItems(productIds, variationIds)
    const validatedItems = getValidatedItems(normalizedCartItems, productsById, variationsById)
    const shippingSettings = await getStoreShippingSettings()
    const originPostalCode = shippingSettings.shipping_origin_zip

    if (!originPostalCode) {
        throw new Error("Configure o CEP de origem do despacho no painel antes de calcular fretes.")
    }

    return calculateMelhorEnvioShippingQuotes({
        originPostalCode,
        destinationPostalCode: normalizedPostalCode,
        subtotal: calculateCheckoutTotal(validatedItems),
        freeShippingThreshold: normalizeFreeShippingThreshold(shippingSettings.free_shipping_threshold),
        processingDays: shippingSettings.processing_days,
        items: validatedItems,
        storeName: shippingSettings.store_name,
        supportEmail: shippingSettings.support_email,
    })
}

export async function resolveCheckoutShippingSelection(
    cartItems: unknown,
    destinationPostalCode: string,
    selection: CheckoutShippingSelection | null | undefined,
) {
    if (!selection?.service_id) {
        throw new Error("Selecione uma opcao de frete antes de finalizar a compra.")
    }

    const normalizedPostalCode = normalizePostalCode(destinationPostalCode)

    if (!normalizedPostalCode) {
        throw new Error("O CEP de entrega informado e invalido. Atualize o CEP e recalcule o frete.")
    }

    const quotes = await quoteShippingOptionsForCart(cartItems, normalizedPostalCode)
    const selectedQuote = quotes.find((quote) => quote.service_id === selection.service_id)

    if (!selectedQuote) {
        const quotedPostalCode = normalizePostalCode(selection.postal_code)

        if (quotedPostalCode && quotedPostalCode !== normalizedPostalCode) {
            throw new Error("A opcao de frete escolhida nao esta disponivel para o CEP informado. Recalcule o frete com esse CEP para continuar.")
        }

        throw new Error("A opcao de frete selecionada nao esta mais disponivel. Recalcule o frete.")
    }

    return selectedQuote
}

export function getShippingChargedAmount(selection: ShippingQuoteOption | CheckoutShippingSelection | null | undefined) {
    return selection?.cost ? Number(selection.cost.toFixed(2)) : 0
}
