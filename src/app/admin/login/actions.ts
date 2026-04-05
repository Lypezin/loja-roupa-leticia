'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/auth'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        // Redireciona com erro via querystring para ser lido no cliente
        redirect('/admin/login?error=Credenciais invalidas')
    }

    if (!isAdminUser(authData.user)) {
        await supabase.auth.signOut()
        redirect('/admin/login?error=Acesso restrito a administradores')
    }

    revalidatePath('/admin', 'layout')
    redirect('/admin')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
}
