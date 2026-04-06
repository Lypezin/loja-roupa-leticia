type UnknownRecord = Record<string, unknown>

export type CheckoutCartItemInput = {
    product_id: string
    variation_id: string
    quantity: number
}

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === 'object' && value !== null
}

function parsePositiveQuantity(value: unknown) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0 || value > 100) {
        throw new Error('Quantidade invalida no carrinho.')
    }

    return value
}

export function parseCheckoutCartItems(input: unknown) {
    if (!Array.isArray(input) || input.length === 0) {
        throw new Error('Carrinho vazio ou invalido.')
    }

    const normalizedItems = new Map<string, CheckoutCartItemInput>()

    for (const rawItem of input) {
        if (!isRecord(rawItem)) {
            throw new Error('Item invalido no carrinho.')
        }

        const productId = rawItem.product_id
        const variationId = rawItem.variation_id
        const quantity = parsePositiveQuantity(rawItem.quantity)

        if (typeof productId !== 'string' || productId.length === 0) {
            throw new Error('Produto invalido no carrinho.')
        }

        if (typeof variationId !== 'string' || variationId.length === 0) {
            throw new Error('Variacao invalida no carrinho.')
        }

        const key = `${productId}:${variationId}`
        const existingItem = normalizedItems.get(key)

        if (existingItem) {
            existingItem.quantity += quantity
            continue
        }

        normalizedItems.set(key, {
            product_id: productId,
            variation_id: variationId,
            quantity,
        })
    }

    return Array.from(normalizedItems.values())
}
