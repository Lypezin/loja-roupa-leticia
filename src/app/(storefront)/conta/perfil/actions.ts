'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { normalizeBrazilPhone, normalizeBrazilState, normalizeCpf, normalizePostalCode } from "@/lib/customer-profile"
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
    const addressStreet = (formData.get("addressStreet") as string)?.trim()
    const addressNumber = (formData.get("addressNumber") as string)?.trim()
    const addressNeighborhood = (formData.get("addressNeighborhood") as string)?.trim()
    const addressComplement = (formData.get("addressComplement") as string)?.trim()
    const city = (formData.get("city") as string)?.trim()
    const state = (formData.get("state") as string)?.trim()
    const postalCode = (formData.get("postalCode") as string)?.trim()
    const nextPath = getSafeRelativePath(formData.get("next"))

    const normalizedPhone = normalizeBrazilPhone(phone)
    const normalizedCpf = normalizeCpf(cpf)
    const normalizedPostalCode = normalizePostalCode(postalCode)
    const normalizedState = normalizeBrazilState(state)
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

    if (!addressStreet || !addressNumber || !addressNeighborhood || !city || !normalizedState || !normalizedPostalCode) {
        redirect(`/conta/perfil?error=${encodeURIComponent("Preencha o endereço de entrega completo para continuar.")}${nextQuery}`)
    }

    const { error: updateError } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            phone: normalizedPhone,
            cpf: normalizedCpf,
            address_street: addressStreet,
            address_number: addressNumber,
            address_neighborhood: addressNeighborhood,
            address_complement: addressComplement || "",
            address_line1: addressStreet,
            address_line2: addressComplement || "",
            city,
            state: normalizedState,
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
