'use server'

import { createClient, requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCategory(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const name = (formData.get('name') as string) || ''

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
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro ao criar categoria.' }
    }
}

export async function deleteCategory(id: string) {
    try {
        const supabase = await requireAdmin()

        // 1. Buscar a categoria para pegar a URL da imagem atual
        const { data: category } = await supabase
            .from('categories')
            .select('image_url')
            .eq('id', id)
            .single()

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            // Pode ser erro de Foreign Key se tiver produtos atrelados
            if (error.code === '23503') return { error: 'Não é possível excluir esta categoria pois há produtos usando ela.' }
            return { error: error.message }
        }

        // 2. Se deletou a categoria com sucesso, e ela tinha imagem, deleta do Storage
        if (category?.image_url) {
            try {
                // Extrair o caminho relativo do arquivo a partir da URL pública
                const urlObj = new URL(category.image_url)
                const pathParts = urlObj.pathname.split('/product-images/')
                if (pathParts.length > 1) {
                    const filePath = pathParts[1] // ex: categories/camisetas/category-123.jpg

                    await supabase.storage
                        .from('product-images')
                        .remove([filePath])
                }
            } catch (storageErr) {
                console.error('Falha ao deletar imagem do storage:', storageErr)
                // Não retorna erro pro usuário pq a categoria já foi excluída, só logamos o erro msm
            }
        }

        revalidatePath('/admin/categorias')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro ao excluir categoria.' }
    }
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const name = (formData.get('name') as string) || ''
        const image = formData.get('image') as File | null

        // Simples gerador de slug
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')

        const updateData: Record<string, string> = { name, slug }

        if (image && image.size > 0) {
            // 1. Buscar a categoria antiga para saber se temos que deletar a imagem velha
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

            // 2. Sucesso no upload da foto nova! Agora deletamos a velha do Storage
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
        revalidatePath('/') // Revalida a home onde as categorias aparecem
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro ao atualizar categoria.' }
    }
}
