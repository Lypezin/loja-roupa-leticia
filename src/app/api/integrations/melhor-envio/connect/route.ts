import { buildMelhorEnvioAuthorizeUrl, getMelhorEnvioEnvironment } from "@/lib/melhor-envio"
import { isAdminUser } from "@/lib/supabase/auth"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const OAUTH_STATE_COOKIE_PREFIX = "me_oauth_state"

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!isAdminUser(user)) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const environment = getMelhorEnvioEnvironment()
    const state = crypto.randomUUID()
    const cookieStore = await cookies()

    cookieStore.set(`${OAUTH_STATE_COOKIE_PREFIX}_${environment}`, state, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 10,
    })

    return NextResponse.redirect(buildMelhorEnvioAuthorizeUrl(state, environment))
}
