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

        const updates: Record<string, any> = {
            hero_title: formData.get('hero_title') as string,
            hero_subtitle: formData.get('hero_subtitle') as string,
            hero_button_text: formData.get('hero_button_text') as string,
            hero_badge_text: formData.get('hero_badge_text') as string,
            hero_secondary_button_text: formData.get('hero_secondary_button_text') as string,
            updated_at: new Date().toISOString()
        }

        // A URL da imagem já foi enviada pelo client-side upload
        const newImageUrl = formData.get('hero_image_url_new') as string
        if (newImageUrl) {
            updates.hero_image_url = newImageUrl
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

export async function saveFooter(formData: FormData) {
    try {
        const supabase = await createClient()
        const id = formData.get('id') as string

        const { error } = await supabase
            .from('store_settings')
            .update({
                footer_about_text: formData.get('footer_about_text') as string,
                footer_newsletter_title: formData.get('footer_newsletter_title') as string,
                footer_newsletter_subtitle: formData.get('footer_newsletter_subtitle') as string,
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

export async function saveContent(formData: FormData) {
    try {
        const supabase = await createClient()
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
    } catch (err: any) {
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}
