// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANTE: refrescando ou buscando o user logado (getUser atualiza os acessos com segurança)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Bloqueando o acesso ao painel admin (mas liberando a rota de login)
    if (
        !user &&
        request.nextUrl.pathname.startsWith('/admin') &&
        request.nextUrl.pathname !== '/admin/login'
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    // Se o ADM estiver logado e for na /admin/login, manda pro dashboard
    if (user && request.nextUrl.pathname === '/admin/login') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
