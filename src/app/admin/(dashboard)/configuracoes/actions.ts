'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProfile(formData: FormData) {
    try {
        const supabase = await createClient()
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
    } catch (err: any) {
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}

export async function saveBanner(formData: FormData) {
    try {
        const supabase = await createClient()
        const id = formData.get('id') as string

        const updates: any = {
            hero_title: formData.get('hero_title') as string,
            hero_subtitle: formData.get('hero_subtitle') as string,
            hero_button_text: formData.get('hero_button_text') as string,
            updated_at: new Date().toISOString()
        }

        let hero_image_url = formData.get('current_hero_image_url') as string
        const imageFile = formData.get('hero_image') as File | null

        if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `store-assets/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, imageFile)

            if (uploadError) {
                return { error: 'Falha ao fazer upload da imagem do banner.' }
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            updates.hero_image_url = publicUrl
        }

        const { error } = await supabase.from('store_settings').update(updates).eq('id', id)
        if (error) return { error: error.message }

        revalidatePath('/admin/configuracoes')
        revalidatePath('/')
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}

export async function saveLogistics(formData: FormData) {
    try {
        const supabase = await createClient()
        const id = formData.get('id') as string

        const thresholdRaw = formData.get('free_shipping_threshold') as string
        const processingRaw = formData.get('processing_days') as string

        const { error } = await supabase
            .from('store_settings')
            .update({
                free_shipping_threshold: thresholdRaw ? parseFloat(thresholdRaw) : null,
                shipping_origin_zip: formData.get('shipping_origin_zip') as string,
                processing_days: processingRaw ? parseInt(processingRaw, 10) : 2,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) return { error: error.message }

        revalidatePath('/admin/configuracoes')
        revalidatePath('/')
        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}
