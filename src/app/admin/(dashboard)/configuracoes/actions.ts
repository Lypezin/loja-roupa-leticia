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

    // Banner config
    const hero_title = formData.get('hero_title') as string
    const hero_subtitle = formData.get('hero_subtitle') as string
    const hero_button_text = formData.get('hero_button_text') as string
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
            console.error('Error uploading image:', uploadError)
            throw new Error('Falha ao fazer upload da imagem do banner.')
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath)

        hero_image_url = publicUrl
    }

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
            hero_title,
            hero_subtitle,
            hero_button_text,
            hero_image_url,
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
