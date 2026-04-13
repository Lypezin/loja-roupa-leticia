'use server'

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/supabase/server"

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Erro ao excluir categoria.'
}

export async function deleteCategory(id: string) {
    try {
        const supabase = await requireAdmin()

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
            if (error.code === '23503') {
                return { error: 'Não é possível excluir esta categoria, pois há produtos usando ela.' }
            }

            return { error: error.message }
        }

        if (category?.image_url) {
            try {
                const urlObj = new URL(category.image_url)
                const pathParts = urlObj.pathname.split('/product-images/')
                if (pathParts.length > 1) {
                    const filePath = pathParts[1]
                    await supabase.storage
                        .from('product-images')
                        .remove([filePath])
                }
            } catch (storageError) {
                console.error('Falha ao deletar imagem do storage:', storageError)
            }
        }

        revalidatePath('/admin/categorias')
        return { success: true }
    } catch (error: unknown) {
        return { error: getErrorMessage(error) }
    }
}
