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
        const senderName = String(formData.get('shipping_sender_name') || '').trim()
        const senderEmail = String(formData.get('shipping_sender_email') || '').trim()
        const senderPhone = String(formData.get('shipping_sender_phone') || '').trim()
        const senderDocument = String(formData.get('shipping_sender_document') || '').trim()
        const senderStateRegister = String(formData.get('shipping_sender_state_register') || '').trim()
        const senderAddress = String(formData.get('shipping_sender_address') || '').trim()
        const senderNumber = String(formData.get('shipping_sender_number') || '').trim()
        const senderDistrict = String(formData.get('shipping_sender_district') || '').trim()
        const senderCity = String(formData.get('shipping_sender_city') || '').trim()
        const senderState = String(formData.get('shipping_sender_state') || '').trim().toUpperCase()
        const senderComplement = String(formData.get('shipping_sender_complement') || '').trim()
        const senderNonCommercial = String(formData.get('shipping_sender_non_commercial') || 'off') === 'on'

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

        const hasAnySenderField = [
            senderName,
            senderEmail,
            senderPhone,
            senderDocument,
            senderAddress,
            senderNumber,
            senderDistrict,
            senderCity,
            senderState,
        ].some(Boolean)

        if (hasAnySenderField) {
            if (!senderName || !senderEmail || !senderPhone || !senderDocument || !senderAddress || !senderNumber || !senderDistrict || !senderCity || !senderState) {
                return { error: 'Preencha todos os dados do remetente para habilitar a emissão de etiquetas.' }
            }

            if (!/^[A-Z]{2}$/.test(senderState)) {
                return { error: 'Informe a UF do remetente com 2 letras.' }
            }
        }

        const { error } = await supabase
            .from('store_settings')
            .update({
                free_shipping_threshold: thresholdValue && thresholdValue > 0 ? thresholdValue : null,
                shipping_origin_zip: originPostalCode,
                processing_days: processingDays,
                shipping_sender_name: senderName || null,
                shipping_sender_email: senderEmail || null,
                shipping_sender_phone: senderPhone || null,
                shipping_sender_document: senderDocument || null,
                shipping_sender_state_register: senderStateRegister || null,
                shipping_sender_address: senderAddress || null,
                shipping_sender_number: senderNumber || null,
                shipping_sender_district: senderDistrict || null,
                shipping_sender_city: senderCity || null,
                shipping_sender_state: senderState || null,
                shipping_sender_complement: senderComplement || null,
                shipping_sender_non_commercial: senderNonCommercial,
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
