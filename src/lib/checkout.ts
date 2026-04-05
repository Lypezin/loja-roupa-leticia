type UnknownRecord = Record<string, unknown>

export type CheckoutCartItemInput = {
    product_id: string
    variation_id: string
    quantity: number
}

export type OrderMetadataItem = {
    product_id: string
    variation_id: string
    quantity: number
    unit_price: number
    product_name: string
    size: string | null
    color: string | null
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

export function buildOrderMetadata(items: OrderMetadataItem[]) {
    return JSON.stringify(items)
}

export function parseOrderMetadataItems(input: unknown) {
    if (!Array.isArray(input) || input.length === 0) {
        throw new Error('Metadados do pedido invalidos.')
    }

    return input.map((rawItem) => {
        if (!isRecord(rawItem)) {
            throw new Error('Item invalido nos metadados do pedido.')
        }

        const productId = rawItem.product_id
        const variationId = rawItem.variation_id
        const quantity = parsePositiveQuantity(rawItem.quantity)
        const unitPrice = rawItem.unit_price
        const productName = rawItem.product_name
        const size = rawItem.size
        const color = rawItem.color

        if (typeof productId !== 'string' || productId.length === 0) {
            throw new Error('Produto invalido nos metadados do pedido.')
        }

        if (typeof variationId !== 'string' || variationId.length === 0) {
            throw new Error('Variacao invalida nos metadados do pedido.')
        }

        if (typeof unitPrice !== 'number' || !Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new Error('Preco invalido nos metadados do pedido.')
        }

        if (typeof productName !== 'string' || productName.length === 0) {
            throw new Error('Nome do produto invalido nos metadados do pedido.')
        }

        if (size !== null && typeof size !== 'string') {
            throw new Error('Tamanho invalido nos metadados do pedido.')
        }

        if (color !== null && typeof color !== 'string') {
            throw new Error('Cor invalida nos metadados do pedido.')
        }

        return {
            product_id: productId,
            variation_id: variationId,
            quantity,
            unit_price: unitPrice,
            product_name: productName,
            size,
            color,
        }
    })
}
