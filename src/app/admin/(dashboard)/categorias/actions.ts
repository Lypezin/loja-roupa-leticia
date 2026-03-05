'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCategory(formData: FormData) {
    try {
        const supabase = await createClient()
        const name = formData.get('name') as string

        // Simples gerador de slug
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')

        const { error } = await supabase
            .from('categories')
            .insert([{ name, slug }])

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
