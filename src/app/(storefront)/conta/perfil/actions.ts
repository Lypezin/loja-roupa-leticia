'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function atualizarPerfil(formData: FormData) {
    const supabase = await createClient()

    // Verifica se o usuário está logado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
        redirect('/conta/login')
    }

    // Pega os dados do form
    const fullName = (formData.get('fullName') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const cpf = (formData.get('cpf') as string)?.trim()

    // Atualiza o user_metadata no Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            phone: phone,
            cpf: cpf
        }
    })

    if (updateError) {
        redirect(`/conta/perfil?error=${encodeURIComponent('Erro ao atualizar dados: ' + updateError.message)}`)
    }

    // Como as informações de conta são lidas na navbar e checkout, revalidamos o layout
    revalidatePath('/', 'layout')
    
    redirect('/conta/perfil?success=' + encodeURIComponent('Dados atualizados com sucesso!'))
}
