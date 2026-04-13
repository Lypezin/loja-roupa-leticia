'use server'

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/supabase/server"
import { validateImageFile } from "@/lib/uploads"

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Erro ao criar categoria.'
}

export async function createCategory(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const name = (formData.get('name') as string) || ''
        const image = formData.get('image') as File | null

        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')

        let image_url = null
        if (image && image.size > 0) {
            validateImageFile(image)

            const fileExt = image.name.split('.').pop()
            const fileName = `category-${Date.now()}.${fileExt}`
            const filePath = `categories/${slug}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, image)

            if (uploadError) {
                return { error: `Falha ao fazer upload da imagem: ${uploadError.message}` }
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            image_url = publicUrl
        }

        const { error } = await supabase
            .from('categories')
            .insert([{ name, slug, image_url }])

        if (error) {
            if (error.code === '23505') {
                return { error: 'Uma categoria com este nome já existe.' }
            }

            return { error: error.message }
        }

        revalidatePath('/admin/categorias')
        revalidatePath('/admin/produtos/novo')
        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error) }
    }
}
