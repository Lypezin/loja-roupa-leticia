// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdminUser } from './auth'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Prevenir que o middleware quebre caso o ambiente esteja incompleto.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Variaveis de ambiente do Supabase ausentes.')
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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login'
    const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login'
    const isAdmin = isAdminUser(user)

    if (isAdminRoute && !isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = user ? '/' : '/admin/login'
        return NextResponse.redirect(url)
    }

    if (user && isAdminLoginRoute && isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
