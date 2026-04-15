// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isAdminUser } from "./auth"

export async function updateSession(request: NextRequest) {
    const pathName = request.nextUrl.pathname
    const isAdminRoute = pathName.startsWith("/admin") && pathName !== "/admin/login"
    const isAccountRoute = pathName.startsWith("/conta") || pathName === "/sucesso" || pathName.startsWith("/auth")

    let supabaseResponse = NextResponse.next({
        request,
    })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Variáveis de ambiente do Supabase ausentes.")

        const fallbackUrl = request.nextUrl.clone()
        fallbackUrl.pathname = isAdminRoute ? "/admin/login" : "/"
        fallbackUrl.search = ""

        return isAdminRoute || isAccountRoute
            ? NextResponse.redirect(fallbackUrl)
            : supabaseResponse
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
                        supabaseResponse.cookies.set(name, value, options),
                    )
                },
            },
        },
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isAdminLoginRoute = pathName === "/admin/login"
    const isAdmin = isAdminUser(user)

    if (isAdminRoute && !isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = user ? "/" : "/admin/login"
        return NextResponse.redirect(url)
    }

    if (user && isAdminLoginRoute && isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
