'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function loginCliente(formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        // Tratar mensagens específicas do Supabase
        let mensagem = 'E-mail ou senha incorretos'

        if (error.message.toLowerCase().includes('email not confirmed')) {
            mensagem = 'Você precisa confirmar seu e-mail antes de fazer login. Verifique sua caixa de entrada.'
        } else if (error.message.toLowerCase().includes('invalid login credentials')) {
            mensagem = 'E-mail ou senha incorretos'
        }

        redirect(`/conta/login?error=${encodeURIComponent(mensagem)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/conta')
}

export async function cadastrarCliente(formData: FormData) {
    const supabase = await createClient()

    const name = (formData.get('name') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`
        }
    })

    if (error) {
        if (error.message.includes('already registered')) {
            redirect('/conta/cadastro?error=Este e-mail já possui uma conta')
        }
        redirect(`/conta/cadastro?error=${encodeURIComponent(error.message)}`)
    }

    // Se o e-mail precisa de confirmação (session será null)
    if (data?.user && !data?.session) {
        redirect('/conta/login?success=Conta criada! Verifique seu e-mail para confirmar o cadastro.')
    }

    // Se confirmação de email está desativada, logou direto
    revalidatePath('/', 'layout')
    redirect('/conta?success=Conta criada com sucesso!')
}

export async function logoutCliente() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
