'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProduct(formData: FormData) {
    try {
        const supabase = await createClient()

        const productId = formData.get('product_id') as string | null
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const base_price = parseFloat(formData.get('base_price') as string)
        const category_id = formData.get('category_id') as string
        const is_active = formData.get('is_active') === 'true'

        const variationsJson = formData.get('variations_json') as string
        const variations = JSON.parse(variationsJson)

        let newProductId = productId

        if (productId) {
            const { error } = await supabase
                .from('products')
                .update({ name, description, base_price, category_id, is_active })
                .eq('id', productId)

            if (error) return { error: error.message }

            await supabase.from('product_variations').delete().eq('product_id', productId)
            const varsToInsert = variations.map((v: any) => ({ ...v, product_id: productId }))
            await supabase.from('product_variations').insert(varsToInsert)

            // Gerenciar imagens existentes (mantidas pelo usuário)
            const existingImagesJson = formData.get('existing_images_json') as string
            if (existingImagesJson) {
                const keptImages = JSON.parse(existingImagesJson)
                const keptUrls = keptImages.map((img: any) => img.image_url)

                // Buscar todas as imagens atuais do produto
                const { data: allImages } = await supabase
                    .from('product_images')
                    .select('id, image_url')
                    .eq('product_id', productId)

                // Deletar as que não foram mantidas
                if (allImages) {
                    const toDelete = allImages.filter((img: any) => !keptUrls.includes(img.image_url))
                    for (const img of toDelete) {
                        await supabase.from('product_images').delete().eq('id', img.id)
                        // Deletar do storage
                        const parts = img.image_url.split('/product-images/')
                        if (parts.length > 1) {
                            await supabase.storage.from('product-images').remove([parts[1]])
                        }
                    }
                }
            }

        } else {
            const { data: productData, error } = await supabase
                .from('products')
                .insert([{ name, description, base_price, category_id, is_active }])
                .select('id')
                .single()

            if (error) return { error: error.message }
            newProductId = productData.id

            const varsToInsert = variations.map((v: any) => ({ ...v, product_id: newProductId }))
            const { error: varError } = await supabase
                .from('product_variations')
                .insert(varsToInsert)

            if (varError) return { error: varError.message }
        }

        // Imagens enviadas pelo client-side upload
        const uploadedUrlsJson = formData.get('uploaded_image_urls') as string
        if (uploadedUrlsJson) {
            const uploadedUrls = JSON.parse(uploadedUrlsJson)
            for (let i = 0; i < uploadedUrls.length; i++) {
                await supabase.from('product_images').insert({
                    product_id: newProductId,
                    image_url: uploadedUrls[i],
                    is_primary: i === 0 && !productId,
                    display_order: i
                })
            }
        }

        revalidatePath('/admin/produtos')
        revalidatePath('/')
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}

export async function deleteProduct(productId: string) {
    try {
        const supabase = await createClient()

        // Deletar imagens do storage
        const { data: images } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', productId)

        if (images && images.length > 0) {
            const filePaths = images
                .map(img => {
                    const url = img.image_url
                    const parts = url.split('/product-images/')
                    return parts.length > 1 ? parts[1] : null
                })
                .filter(Boolean) as string[]

            if (filePaths.length > 0) {
                await supabase.storage.from('product-images').remove(filePaths)
            }
        }

        // Deletar registros relacionados
        await supabase.from('product_images').delete().eq('product_id', productId)
        await supabase.from('product_variations').delete().eq('product_id', productId)

        const { error } = await supabase.from('products').delete().eq('id', productId)
        if (error) return { error: error.message }

        revalidatePath('/admin/produtos')
        revalidatePath('/')
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro ao excluir produto.' }
    }
}
