import type { AbacatePayBillingProduct } from "@/lib/abacatepay"
import { createClient } from "@/lib/supabase/server"
import { ProductRecord, VariationRecord, ValidatedCheckoutItem } from "@/types/checkout"
import type { CheckoutShippingSelection } from "@/types/shipping"

type CheckoutCartItem = {
    product_id: string
    variation_id: string
    quantity: number
}

export async function validateCheckoutItems(productIds: string[], variationIds: string[]) {
    const supabase = await createClient()

    const [{ data: products, error: productError }, { data: variations, error: variationError }] = await Promise.all([
        supabase
            .from("products")
            .select("id, name, base_price, is_active, weight_kg, height_cm, width_cm, length_cm")
            .in("id", productIds)
            .eq("is_active", true),
        supabase
            .from("product_variations")
            .select("id, product_id, size, color, stock_quantity")
            .in("id", variationIds),
    ])

    if (productError || !products || products.length !== productIds.length) {
        throw new Error("Falha ao validar os produtos selecionados.")
    }

    if (variationError || !variations || variations.length !== variationIds.length) {
        throw new Error("Falha ao validar as variações do carrinho.")
    }

    return {
        productsById: new Map<string, ProductRecord>((products as ProductRecord[]).map((product) => [product.id, product])),
        variationsById: new Map<string, VariationRecord>((variations as VariationRecord[]).map((variation) => [variation.id, variation])),
    }
}

export function getValidatedItems(
    normalizedCartItems: CheckoutCartItem[],
    productsById: Map<string, ProductRecord>,
    variationsById: Map<string, VariationRecord>
): ValidatedCheckoutItem[] {
    return normalizedCartItems.map((cartItem) => {
        const productInfo = productsById.get(cartItem.product_id)
        const variationInfo = variationsById.get(cartItem.variation_id)

        if (!productInfo || !productInfo.is_active) {
            throw new Error("Produto indisponível para checkout.")
        }

        if (!variationInfo || variationInfo.product_id !== productInfo.id) {
            throw new Error(`Variação inválida para o produto ${productInfo.name}.`)
        }

        if (variationInfo.stock_quantity < cartItem.quantity) {
            throw new Error(`Estoque insuficiente para ${productInfo.name}.`)
        }

        const weightKg = productInfo.weight_kg
        const heightCm = productInfo.height_cm
        const widthCm = productInfo.width_cm
        const lengthCm = productInfo.length_cm

        if (!weightKg || !heightCm || !widthCm || !lengthCm) {
            throw new Error(`O produto ${productInfo.name} ainda nao possui peso e dimensoes configurados.`)
        }

        return {
            product_id: productInfo.id,
            product_name: productInfo.name,
            variation_id: variationInfo.id,
            size: variationInfo.size,
            color: variationInfo.color,
            unit_price: productInfo.base_price,
            quantity: cartItem.quantity,
            weight_kg: weightKg,
            height_cm: heightCm,
            width_cm: widthCm,
            length_cm: lengthCm,
        }
    })
}

export function buildAbacatePayProducts(validatedItems: ValidatedCheckoutItem[]): AbacatePayBillingProduct[] {
    return validatedItems.map((item) => {
        const descriptionParts = [item.color ? `Cor: ${item.color}` : "", item.size ? `Tamanho: ${item.size}` : ""]
            .filter(Boolean)

        return {
            externalId: `${item.product_id}:${item.variation_id}`,
            name: item.product_name,
            description: descriptionParts.join(" | ") || undefined,
            quantity: item.quantity,
            price: Math.round(item.unit_price * 100),
        }
    })
}

export function buildAbacatePayBillingProducts(
    validatedItems: ValidatedCheckoutItem[],
    shippingSelection?: CheckoutShippingSelection | null,
): AbacatePayBillingProduct[] {
    const products = buildAbacatePayProducts(validatedItems)

    if (!shippingSelection || shippingSelection.cost <= 0) {
        return products
    }

    return [
        ...products,
        {
            externalId: `shipping:${shippingSelection.service_id}`,
            name: `Frete ${shippingSelection.service_name}`,
            description: `${shippingSelection.company_name} | CEP ${shippingSelection.postal_code}`,
            quantity: 1,
            price: Math.round(shippingSelection.cost * 100),
        },
    ]
}

export function calculateCheckoutTotal(validatedItems: ValidatedCheckoutItem[], shippingCost = 0) {
    return Number(
        (validatedItems.reduce((total, item) => total + (item.unit_price * item.quantity), 0) + shippingCost).toFixed(2)
    )
}
