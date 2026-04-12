'use server'

import { requireAdmin } from "@/lib/supabase/server"
import { validateImageFile } from "@/lib/uploads"
import { revalidatePath } from "next/cache"

export async function saveBanner(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const id = formData.get('id') as string

        const updates: Record<string, string | number | null> = {
            hero_title: formData.get('hero_title') as string,
            hero_subtitle: formData.get('hero_subtitle') as string,
            hero_button_text: formData.get('hero_button_text') as string,
            hero_badge_text: formData.get('hero_badge_text') as string,
            hero_secondary_button_text: formData.get('hero_secondary_button_text') as string,
            countdown_end: formData.get('countdown_end') as string || null,
            updated_at: new Date().toISOString()
        }

        const heroImage = formData.get('hero_image') as File | null
        if (heroImage && heroImage.size > 0) {
            validateImageFile(heroImage)
            
            const { data: currentSettings } = await supabase
                .from('store_settings')
                .select('hero_image_url')
                .eq('id', id)
                .single()

            const fileExt = heroImage.name.split('.').pop()
            const fileName = `hero-banner-${Date.now()}.${fileExt}`
            const filePath = `settings/banner/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, heroImage)

            if (uploadError) {
                return { error: 'Falha ao subir a nova imagem do banner: ' + uploadError.message }
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            updates.hero_image_url = publicUrl

            if (currentSettings?.hero_image_url) {
                try {
                    const urlObj = new URL(currentSettings.hero_image_url)
                    const pathParts = urlObj.pathname.split('/product-images/')
                    if (pathParts.length > 1) {
                        const oldFilePath = pathParts[1]
                        await supabase.storage
                            .from('product-images')
                            .remove([oldFilePath])
                    }
                } catch (storageErr) {
                    console.error('Falha ao deletar banner antigo:', storageErr)
                }
            }
        }

        const { error } = await supabase.from('store_settings').update(updates).eq('id', id)
        if (error) return { error: error.message }

        revalidatePath('/admin/configuracoes')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro Interno no Servidor.' }
    }
}
