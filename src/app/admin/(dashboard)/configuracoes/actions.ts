'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveSettings(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const store_name = formData.get('store_name') as string
    const store_description = formData.get('store_description') as string
    const support_email = formData.get('support_email') as string
    const whatsapp_number = formData.get('whatsapp_number') as string
    const instagram_url = formData.get('instagram_url') as string

    const thresholdRaw = formData.get('free_shipping_threshold') as string
    const free_shipping_threshold = thresholdRaw ? parseFloat(thresholdRaw) : null

    const shipping_origin_zip = formData.get('shipping_origin_zip') as string

    const processingRaw = formData.get('processing_days') as string
    const processing_days = processingRaw ? parseInt(processingRaw, 10) : 2

    const { error } = await supabase
        .from('store_settings')
        .update({
            store_name,
            store_description,
            support_email,
            whatsapp_number,
            instagram_url,
            free_shipping_threshold,
            shipping_origin_zip,
            processing_days,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    // Revalida a rota para limpar o cache na proxima exibiçao
    revalidatePath('/admin/configuracoes')
    revalidatePath('/')
}
