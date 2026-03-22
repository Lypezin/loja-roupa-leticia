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
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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
    const isAdmin = userRole === 'admin'
    // Clientes cadastrados com role 'customer' ou contas incompletas NÃO são admin

    // Bloqueando o acesso ao admin: sem permissão de admin (não logado ou logado sem ser admin)
    if (isAdminRoute && !isAdmin) {
        const url = request.nextUrl.clone()
        // Se estiver logado (mas não é admin), manda pra home. Se não estiver logado, manda pro login admin.
        url.pathname = user ? '/' : '/admin/login'
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
