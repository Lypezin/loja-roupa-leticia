'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { buildIpAndUserIdentifiers, enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit"
import { getServerActionSecurityContext } from "@/lib/security/request-context"
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/auth'

export async function login(formData: FormData) {
    const supabase = await createClient()
    const securityContext = await getServerActionSecurityContext()

    const data = {
        email: (formData.get('email') as string)?.trim(),
        password: formData.get('password') as string,
    }

    if (!data.email || !data.password) {
        redirect('/admin/login?error=Informe e-mail e senha')
    }

    try {
        await enforceRateLimit({
            scope: "auth:admin-login",
            maxAttempts: 5,
            windowSeconds: 60 * 15,
            blockSeconds: 60 * 20,
            identifiers: buildIpAndUserIdentifiers(securityContext, null, data.email),
        })
    } catch (error) {
        if (error instanceof RateLimitError) {
            redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
        }

        throw error
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/admin/login?error=Credenciais invalidas')
    }

    if (!isAdminUser(authData.user)) {
        await supabase.auth.signOut()
        redirect('/admin/login?error=Credenciais invalidas')
    }

    revalidatePath('/admin', 'layout')
    redirect('/admin')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
}
