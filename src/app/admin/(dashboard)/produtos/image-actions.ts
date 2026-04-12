import { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type ProductImageRef = Pick<Database["public"]["Tables"]["product_images"]["Row"], "id" | "image_url">
type ExistingImageInput = Pick<Database["public"]["Tables"]["product_images"]["Row"], "id" | "image_url" | "is_primary" | "display_order">

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
        .map((image, index) => ({
            ...image,
            is_primary: Boolean(image.is_primary),
            display_order: typeof image.display_order === "number" ? image.display_order : index,
        }))
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

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

    for (const [index, image] of keptImages.entries()) {
        const updatePayload = {
            is_primary: Boolean(image.is_primary),
            display_order: index,
        }

        if (image.id) {
            const { error: updateImageError } = await supabase
                .from("product_images")
                .update(updatePayload)
                .eq("id", image.id)

            if (updateImageError) {
                throw updateImageError
            }
            continue
        }

        const { error: updateByUrlError } = await supabase
            .from("product_images")
            .update(updatePayload)
            .eq("product_id", productId)
            .eq("image_url", image.image_url)

        if (updateByUrlError) {
            throw updateByUrlError
        }
    }

    const uploadedUrls = parseJson<string[]>(uploadedUrlsJson, [])
    const hasPrimaryImage = keptImages.some((image) => image.is_primary)

    for (const [index, imageUrl] of uploadedUrls.entries()) {
        const { error: insertImageError } = await supabase.from("product_images").insert({
            product_id: productId,
            image_url: imageUrl,
            is_primary: !hasPrimaryImage && index === 0,
            display_order: keptImages.length + index,
        })

        if (insertImageError) {
            throw insertImageError
        }
    }
}
