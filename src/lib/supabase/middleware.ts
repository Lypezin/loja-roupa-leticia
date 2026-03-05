// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Prevenir que o Vercel Edge Middleware quebre com Erro 500 caso o usuário esqueça as variáveis
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Variáveis de ambiente do Supabase ausentes. Por favor, adicione-as na Vercel.')
        return supabaseResponse
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login'
    const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login'

    // Verificar se o usuário é admin (role nos metadados OU email do admin configurado)
    const userRole = user?.user_metadata?.role
    const isAdmin = userRole === 'admin' || userRole !== 'customer'
    // Clientes cadastrados com role 'customer' NÃO são admin

    // Bloqueando o acesso ao admin: sem login -> tela de login
    if (!user && isAdminRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    // Bloqueando o acesso ao admin: logado como CLIENTE -> manda pra home
    if (user && isAdminRoute && userRole === 'customer') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Se o ADM estiver logado e for na /admin/login, manda pro dashboard
    if (user && isAdminLoginRoute && isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
