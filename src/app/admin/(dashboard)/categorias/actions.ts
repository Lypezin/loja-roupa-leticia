'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCategory(formData: FormData) {
    try {
        const supabase = await createClient()
        const name = formData.get('name') as string

        const image = formData.get('image') as File | null

        // Simples gerador de slug
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')

        let image_url = null
        if (image && image.size > 0) {
            const fileExt = image.name.split('.').pop()
            const fileName = `category-${Date.now()}.${fileExt}`
            const filePath = `categories/${slug}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, image)

            if (uploadError) {
                return { error: 'Falha ao fazer upload da imagem: ' + uploadError.message }
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
            if (error.code === '23505') return { error: 'Uma categoria com este nome já existe.' }
            return { error: error.message }
        }

        revalidatePath('/admin/categorias')
        revalidatePath('/admin/produtos/novo')
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro ao criar categoria.' }
    }
}

export async function deleteCategory(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            // Pode ser erro de Foreign Key se tiver produtos atrelados
            if (error.code === '23503') return { error: 'Não é possível excluir esta categoria pois há produtos usando ela.' }
            return { error: error.message }
        }

        revalidatePath('/admin/categorias')
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro ao excluir categoria.' }
    }
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        const supabase = await createClient()
        const name = formData.get('name') as string
        const image = formData.get('image') as File | null

        // Simples gerador de slug
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')

        const updateData: any = { name, slug }

        if (image && image.size > 0) {
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
        revalidatePath('/') // Revalida a home onde as categorias aparecem
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro ao atualizar categoria.' }
    }
}
