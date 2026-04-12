'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { normalizeBrazilPhone, normalizeCpf, normalizePostalCode } from "@/lib/customer-profile"
import { createClient } from "@/lib/supabase/server"
import { getSafeRelativePath } from "@/lib/url-safety"

export async function atualizarPerfil(formData: FormData) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect("/conta/login")
    }

    const fullName = (formData.get("fullName") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const cpf = (formData.get("cpf") as string)?.trim()
    const addressLine1 = (formData.get("addressLine1") as string)?.trim()
    const addressLine2 = (formData.get("addressLine2") as string)?.trim()
    const city = (formData.get("city") as string)?.trim()
    const state = (formData.get("state") as string)?.trim()
    const postalCode = (formData.get("postalCode") as string)?.trim()
    const nextPath = getSafeRelativePath(formData.get("next"))

    const normalizedPhone = normalizeBrazilPhone(phone)
    const normalizedCpf = normalizeCpf(cpf)
    const normalizedPostalCode = normalizePostalCode(postalCode)
    const nextQuery = nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""

    if (!fullName) {
        redirect(`/conta/perfil?error=${encodeURIComponent("Nome completo é obrigatório.")}${nextQuery}`)
    }

    if (!normalizedPhone) {
        redirect(`/conta/perfil?error=${encodeURIComponent("Telefone inválido. Informe um número brasileiro válido.")}${nextQuery}`)
    }

    if (!normalizedCpf) {
        redirect(`/conta/perfil?error=${encodeURIComponent("CPF inválido. Confira os dígitos informados.")}${nextQuery}`)
    }

    if (!addressLine1 || !city || !state || !normalizedPostalCode) {
        redirect(`/conta/perfil?error=${encodeURIComponent("Preencha o endereço de entrega completo para continuar.")}${nextQuery}`)
    }

    const { error: updateError } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            phone: normalizedPhone,
            cpf: normalizedCpf,
            address_line1: addressLine1,
            address_line2: addressLine2 || "",
            city,
            state,
            postal_code: normalizedPostalCode,
            country: "BR",
        },
    })

    if (updateError) {
        redirect(`/conta/perfil?error=${encodeURIComponent(`Erro ao atualizar dados: ${updateError.message}`)}${nextQuery}`)
    }

    revalidatePath("/", "layout")

    if (nextPath) {
        redirect(nextPath)
    }

    redirect(`/conta/perfil?success=${encodeURIComponent("Dados atualizados com sucesso!")}`)
}
