import { getMelhorEnvioEnvironment, saveMelhorEnvioTokensFromCode } from "@/lib/melhor-envio"
import { isAdminUser } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const OAUTH_STATE_COOKIE_PREFIX = "me_oauth_state"

function redirectWithStatus(request: Request, status: "connected" | "error", message?: string) {
    const redirectUrl = new URL("/admin/configuracoes", request.url)
    redirectUrl.searchParams.set("melhor_envio", status)

    if (message) {
        redirectUrl.searchParams.set("message", message)
    }

    return NextResponse.redirect(redirectUrl)
}

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!isAdminUser(user)) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const state = requestUrl.searchParams.get("state")
    const environment = getMelhorEnvioEnvironment()
    const cookieStore = await cookies()
    const cookieName = `${OAUTH_STATE_COOKIE_PREFIX}_${environment}`
    const savedState = cookieStore.get(cookieName)?.value

    cookieStore.delete(cookieName)

    if (!code || !state || !savedState || state !== savedState) {
        return redirectWithStatus(request, "error", "Falha ao validar o retorno do Melhor Envio.")
    }

    try {
        await saveMelhorEnvioTokensFromCode(code, environment)
        return redirectWithStatus(request, "connected")
    } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao conectar o Melhor Envio."
        return redirectWithStatus(request, "error", message)
    }
}
