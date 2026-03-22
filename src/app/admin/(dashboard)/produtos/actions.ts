'use server'

import { requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { manageProductImages } from "./image-actions"
import { updateProductVariations } from "./variation-actions"

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

        let finalId = productId
        if (productId) {
            await supabase.from('products').update({ name, description, base_price, category_id, is_active }).eq('id', productId)
        } else {
            const { data, error } = await supabase.from('products').insert([{ name, description, base_price, category_id, is_active }]).select('id').single()
            if (error || !data) throw new Error(error?.message || 'Erro ao criar produto.')
            finalId = data.id
        }

        await updateProductVariations(supabase, finalId!, variations)
        await manageProductImages(supabase, finalId!, formData.get('existing_images_json') as string, formData.get('uploaded_image_urls') as string)

        revalidatePath('/admin/produtos'); revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Erro ao salvar produto.' }
    }
}

export async function deleteProduct(productId: string) {
    try {
        const supabase = await requireAdmin()
        
        // Simplified: delete relations then product
        await supabase.from('product_images').delete().eq('product_id', productId)
        await supabase.from('product_variations').delete().eq('product_id', productId)
        const { error } = await supabase.from('products').delete().eq('id', productId)
        
        if (error) throw error
        revalidatePath('/admin/produtos'); revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Erro ao excluir produto.' }
    }
}
