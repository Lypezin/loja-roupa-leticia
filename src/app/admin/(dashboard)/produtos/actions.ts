'use server'

import { requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { manageProductImages } from "./image-actions"
import { updateProductVariations } from "./variation-actions"

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return fallback
}

export async function saveProduct(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const productId = formData.get('product_id') as string | null
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const base_price = parseFloat(formData.get('base_price') as string)
        const category_id = formData.get('category_id') as string
        const is_active = formData.get('is_active') === 'true'
        const variations = JSON.parse(formData.get('variations_json') as string)

        if (!name?.trim()) {
            throw new Error('Nome do produto e obrigatorio.')
        }

        if (!Number.isFinite(base_price) || base_price < 0) {
            throw new Error('Preco do produto invalido.')
        }

        let finalId = productId

        if (productId) {
            const { error } = await supabase
                .from('products')
                .update({ name, description, base_price, category_id, is_active })
                .eq('id', productId)

            if (error) {
                throw error
            }
        } else {
            const { data, error } = await supabase
                .from('products')
                .insert([{ name, description, base_price, category_id, is_active }])
                .select('id')
                .single()

            if (error || !data) {
                throw new Error(error?.message || 'Erro ao criar produto no banco.')
            }

            finalId = data.id
        }

        await updateProductVariations(supabase, finalId!, variations)
        await manageProductImages(
            supabase,
            finalId!,
            formData.get('existing_images_json') as string,
            formData.get('uploaded_image_urls') as string
        )

        revalidatePath('/admin/produtos')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error, 'Erro ao salvar produto.') }
    }
}

export async function deleteProduct(productId: string) {
    try {
        const supabase = await requireAdmin()

        const { data: productImages, error: productImagesError } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', productId)

        if (productImagesError) {
            throw productImagesError
        }

        const storagePaths = (productImages ?? [])
            .map((image) => {
                const parts = image.image_url.split('/product-images/')
                return parts.length > 1 ? parts[1] : null
            })
            .filter((path): path is string => Boolean(path))

        if (storagePaths.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('product-images')
                .remove(storagePaths)

            if (storageError) {
                throw storageError
            }
        }

        const { error: imagesDeleteError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId)

        if (imagesDeleteError) {
            throw imagesDeleteError
        }

        const { error: variationsDeleteError } = await supabase
            .from('product_variations')
            .delete()
            .eq('product_id', productId)

        if (variationsDeleteError) {
            throw variationsDeleteError
        }

        const { error } = await supabase.from('products').delete().eq('id', productId)

        if (error) throw error
        revalidatePath('/admin/produtos')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error, 'Erro ao excluir produto.') }
    }
}
