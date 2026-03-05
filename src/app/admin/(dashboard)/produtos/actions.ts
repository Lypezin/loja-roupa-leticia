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

            const { error: delVarError } = await supabase.from('product_variations').delete().eq('product_id', productId)
            if (delVarError) return { error: `Erro ao remover variações antigas: ${(delVarError as Error).message}` }

            const varsToInsert = variations.map((v: Record<string, unknown>) => {
                const { id, created_at, updated_at, ...rest } = v;
                return { ...rest, product_id: productId };
            })
            const { error: insVarError } = await supabase.from('product_variations').insert(varsToInsert)
            if (insVarError) return { error: `Erro ao inserir novas variações: ${(insVarError as Error).message}` }

            // Gerenciar imagens existentes (mantidas pelo usuário)
            const existingImagesJson = formData.get('existing_images_json') as string
            if (existingImagesJson) {
                const keptImages = JSON.parse(existingImagesJson)
                const keptUrls = keptImages.map((img: Record<string, string>) => img.image_url)

                // Buscar todas as imagens atuais do produto
                const { data: allImages } = await supabase
                    .from('product_images')
                    .select('id, image_url')
                    .eq('product_id', productId)

                // Deletar as que não foram mantidas
                if (allImages) {
                    const toDelete = allImages.filter((img: { id: string, image_url: string }) => !keptUrls.includes(img.image_url))
                    for (const img of toDelete) {
                        const { error: delImgError } = await supabase.from('product_images').delete().eq('id', img.id)
                        if (delImgError) {
                            console.error('Falha ao deletar registro da imagem:', delImgError)
                            continue; // Continua tentando deletar as outras
                        }
                        // Deletar do storage
                        const parts = img.image_url.split('/product-images/')
                        if (parts.length > 1) {
                            const { error: storageError } = await supabase.storage.from('product-images').remove([parts[1]])
                            if (storageError) console.error('Falha ao deletar arquivo do storage:', storageError)
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

            const varsToInsert = variations.map((v: Record<string, unknown>) => {
                const { id, created_at, updated_at, ...rest } = v;
                return { ...rest, product_id: newProductId };
            })
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
                const { error: imgInsertError } = await supabase.from('product_images').insert({
                    product_id: newProductId,
                    image_url: uploadedUrls[i],
                    is_primary: i === 0 && !productId,
                    display_order: i
                })
                if (imgInsertError) {
                    console.error('Falha ao inserir imagem no banco:', imgInsertError)
                    // Nao vamos abortar o request todo se 1 imagem falhar, mas idealmente poderiamos.
                }
            }
        }

        revalidatePath('/admin/produtos')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
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
                const { error: storageError } = await supabase.storage.from('product-images').remove(filePaths)
                if (storageError) console.error('Aviso: falha ao deletar algumas imagens do storage', storageError)
            }
        }

        // Deletar registros relacionados
        const { error: delImagesError } = await supabase.from('product_images').delete().eq('product_id', productId)
        if (delImagesError) return { error: `Erro ao deletar imagens: ${(delImagesError as Error).message}` }

        const { error: delVarsError } = await supabase.from('product_variations').delete().eq('product_id', productId)
        if (delVarsError) return { error: `Erro ao deletar variações: ${(delVarsError as Error).message}` }

        const { error } = await supabase.from('products').delete().eq('id', productId)
        if (error) return { error: error.message }

        revalidatePath('/admin/produtos')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro ao excluir produto.' }
    }
}
