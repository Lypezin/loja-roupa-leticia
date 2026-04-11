import { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type ProductImageRef = Pick<Database["public"]["Tables"]["product_images"]["Row"], "id" | "image_url">
type ExistingImageInput = Pick<Database["public"]["Tables"]["product_images"]["Row"], "image_url">

function parseJson<T>(value: string | null, fallback: T): T {
    if (!value) {
        return fallback
    }

    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

export async function manageProductImages(
    supabase: SupabaseClient<Database>,
    productId: string,
    existingImagesJson: string | null,
    uploadedUrlsJson: string | null,
) {
    const keptImages = parseJson<ExistingImageInput[]>(existingImagesJson, [])
    const keptUrls = keptImages.map((image) => image.image_url)

    if (existingImagesJson) {
        const { data: allImages, error: listError } = await supabase
            .from("product_images")
            .select("id, image_url")
            .eq("product_id", productId)

        if (listError) {
            throw listError
        }

        const toDelete: ProductImageRef[] = (allImages ?? []).filter((image) => !keptUrls.includes(image.image_url))

        for (const image of toDelete) {
            const { error: deleteImageError } = await supabase.from("product_images").delete().eq("id", image.id)
            if (deleteImageError) {
                throw deleteImageError
            }

            const parts = image.image_url.split("/product-images/")
            if (parts.length > 1) {
                const { error: removeStorageError } = await supabase.storage.from("product-images").remove([parts[1]])
                if (removeStorageError) {
                    throw removeStorageError
                }
            }
        }
    }

    const uploadedUrls = parseJson<string[]>(uploadedUrlsJson, [])
    for (const [index, imageUrl] of uploadedUrls.entries()) {
        const { error: insertImageError } = await supabase.from("product_images").insert({
            product_id: productId,
            image_url: imageUrl,
            is_primary: index === 0 && keptImages.length === 0,
            display_order: index + 10,
        })

        if (insertImageError) {
            throw insertImageError
        }
    }
}
