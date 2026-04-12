'use server'

import { requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProfile(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const id = formData.get('id') as string

        const { error } = await supabase
            .from('store_settings')
            .update({
                store_name: formData.get('store_name') as string,
                store_description: formData.get('store_description') as string,
                support_email: formData.get('support_email') as string,
                whatsapp_number: formData.get('whatsapp_number') as string,
                instagram_url: formData.get('instagram_url') as string,
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
