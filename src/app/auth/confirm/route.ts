import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Rota que processa o link de confirmação de email enviado pelo Supabase
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = '/conta?success=Email confirmado com sucesso! Bem-vindo(a)!'

    // Cria o link de redirecionamento sem o token secreto
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = '/conta'
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            redirectTo.searchParams.set('success', 'Email confirmado com sucesso! Bem-vindo(a)!')
            return NextResponse.redirect(redirectTo)
        }
    }

    // Se houver erro, manda para login com mensagem
    redirectTo.pathname = '/conta/login'
    redirectTo.searchParams.set('error', 'Link de confirmação inválido ou expirado. Tente fazer login novamente.')
    return NextResponse.redirect(redirectTo)
}
