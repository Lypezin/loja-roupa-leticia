'use server'

import { normalizePostalCode } from "@/lib/customer-profile"
import { getMelhorEnvioEnvironment } from "@/lib/melhor-envio/config"
import { disconnectMelhorEnvioIntegration } from "@/lib/melhor-envio/storage"
import { requireAdmin } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveLogistics(formData: FormData) {
    try {
        const supabase = await requireAdmin()
        const id = formData.get('id') as string

        const thresholdRaw = String(formData.get('free_shipping_threshold') || '').trim()
        const processingRaw = String(formData.get('processing_days') || '').trim()
        const originPostalCode = normalizePostalCode(String(formData.get('shipping_origin_zip') || '').trim())

        const thresholdValue = thresholdRaw ? Number.parseFloat(thresholdRaw.replace(',', '.')) : null
        if (thresholdRaw && (thresholdValue === null || !Number.isFinite(thresholdValue) || thresholdValue <= 0)) {
            return { error: 'Informe um valor maior que zero para ativar o frete grátis.' }
        }

        const processingDays = processingRaw ? Number.parseInt(processingRaw, 10) : 2
        if (!Number.isInteger(processingDays) || processingDays < 0) {
            return { error: 'Informe um prazo de preparação válido.' }
        }

        const rawOriginPostalCode = String(formData.get('shipping_origin_zip') || '').trim()
        if (rawOriginPostalCode && !originPostalCode) {
            return { error: 'Informe um CEP de origem válido.' }
        }

        const { error } = await supabase
            .from('store_settings')
            .update({
                free_shipping_threshold: thresholdValue && thresholdValue > 0 ? thresholdValue : null,
                shipping_origin_zip: originPostalCode,
                processing_days: processingDays,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)

        if (error) {
            return { error: error.message }
        }

        revalidatePath('/admin/configuracoes')
        revalidatePath('/')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro interno no servidor.' }
    }
}

export async function disconnectMelhorEnvioAccount() {
    try {
        await requireAdmin()
        const environment = getMelhorEnvioEnvironment()
        await disconnectMelhorEnvioIntegration(environment)
        revalidatePath('/admin/configuracoes')
        return { success: true }
    } catch (error: unknown) {
        const err = error as Error
        return { error: err.message || 'Erro interno no servidor.' }
    }
}
