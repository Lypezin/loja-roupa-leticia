'use server'

import { requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveFooter(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const id = formData.get('id') as string

        const { error } = await supabase
            .from('store_settings')
            .update({
                footer_about_text: formData.get('footer_about_text') as string,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) return { error: error.message }

        revalidatePath('/admin/configuracoes')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}

export async function saveContent(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const id = formData.get('id') as string

        const { error } = await supabase
            .from('store_settings')
            .update({
                products_section_label: formData.get('products_section_label') as string,
                products_section_title: formData.get('products_section_title') as string,
                categories_section_label: formData.get('categories_section_label') as string,
                categories_section_title: formData.get('categories_section_title') as string,
                trust_banner_1_title: formData.get('trust_banner_1_title') as string,
                trust_banner_1_desc: formData.get('trust_banner_1_desc') as string,
                trust_banner_2_title: formData.get('trust_banner_2_title') as string,
                trust_banner_2_desc: formData.get('trust_banner_2_desc') as string,
                trust_banner_3_title: formData.get('trust_banner_3_title') as string,
                trust_banner_3_desc: formData.get('trust_banner_3_desc') as string,
                trust_banner_4_title: formData.get('trust_banner_4_title') as string,
                trust_banner_4_desc: formData.get('trust_banner_4_desc') as string,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) return { error: error.message }

        revalidatePath('/admin/configuracoes')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}
