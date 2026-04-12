import { Variation, ExistingImage } from "@/types/product"

export function sanitizeVariation(variation: Variation) {
    return {
        size: variation.size.trim(),
        color: variation.color.trim(),
        stock_quantity: Number.isFinite(variation.stock_quantity) ? Math.max(0, variation.stock_quantity) : 0,
    }
}

export function normalizeExistingImages(images: ExistingImage[]) {
    if (images.length === 0) {
        return []
    }

    const primaryIndex = images.findIndex((image) => image.is_primary)
    const normalizedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0

    return images.map((image, index) => ({
        ...image,
        is_primary: index === normalizedPrimaryIndex,
        display_order: index,
    }))
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message
    }
    return "Falha ao salvar produto."
}
