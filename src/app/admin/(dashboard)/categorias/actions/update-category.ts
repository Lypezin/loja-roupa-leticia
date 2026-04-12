'use server'

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/supabase/server"
import { validateImageFile } from "@/lib/uploads"

export async function updateCategory(id: string, formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const name = (formData.get('name') as string) || ''
        const image = formData.get('image') as File | null

        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')
        const updateData: Record<string, string> = { name, slug }

        if (image && image.size > 0) {
            validateImageFile(image)

            const { data: oldCategory } = await supabase
                .from('categories')
                .select('image_url')
                .eq('id', id)
                .single()

            const fileExt = image.name.split('.').pop()
            const fileName = `category-${Date.now()}.${fileExt}`
            const filePath = `categories/${slug}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, image)

            if (uploadError) {
                return { error: 'Falha ao subir a nova imagem: ' + uploadError.message }
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            updateData.image_url = publicUrl

            if (oldCategory?.image_url) {
                try {
                    const urlObj = new URL(oldCategory.image_url)
                    const pathParts = urlObj.pathname.split('/product-images/')
                    if (pathParts.length > 1) {
                        const oldFilePath = pathParts[1]
                        await supabase.storage
                            .from('product-images')
                            .remove([oldFilePath])
                    }
                } catch (storageErr) {
                    console.error('Falha ao deletar imagem antiga do storage:', storageErr)
                }
            }
        }

        const { error } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', id)

        if (error) {
            if (error.code === '23505') return { error: 'Uma categoria com este nome já existe.' }
            return { error: error.message }
        }

        revalidatePath('/admin/categorias')
        revalidatePath('/admin/produtos/novo')
        revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Erro ao atualizar categoria.' }
    }
}
