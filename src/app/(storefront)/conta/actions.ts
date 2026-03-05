'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function loginCliente(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        redirect('/conta/login?error=E-mail ou senha incorretos')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function cadastrarCliente(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: 'customer'
            }
        }
    })

    if (error) {
        if (error.message.includes('already registered')) {
            redirect('/conta/cadastro?error=Este e-mail já possui uma conta')
        }
        redirect(`/conta/cadastro?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/conta?success=Conta criada com sucesso!')
}

export async function logoutCliente() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
