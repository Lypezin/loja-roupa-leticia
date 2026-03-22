import { SupabaseClient } from "@supabase/supabase-js"

export async function manageProductImages(supabase: SupabaseClient, productId: string, existingImagesJson: string | null, uploadedUrlsJson: string | null) {
    // 1. Deletar imagens removidas
    if (existingImagesJson) {
        const keptImages = JSON.parse(existingImagesJson)
        const keptUrls = keptImages.map((img: any) => img.image_url)

        const { data: allImages } = await supabase
            .from('product_images')
            .select('id, image_url')
            .eq('product_id', productId)

        if (allImages) {
            const toDelete = allImages.filter((img: any) => !keptUrls.includes(img.image_url))
            for (const img of toDelete) {
                await supabase.from('product_images').delete().eq('id', img.id)
                const parts = img.image_url.split('/product-images/')
                if (parts.length > 1) {
                    await supabase.storage.from('product-images').remove([parts[1]])
                }
            }
        }
    }

    // 2. Inserir novas imagens
    if (uploadedUrlsJson) {
        const uploadedUrls = JSON.parse(uploadedUrlsJson)
        for (let i = 0; i < uploadedUrls.length; i++) {
            await supabase.from('product_images').insert({
                product_id: productId,
                image_url: uploadedUrls[i],
                is_primary: i === 0 && !existingImagesJson, // simplistic primary logic
                display_order: i + 10 // avoid overlap
            })
        }
    }
}
