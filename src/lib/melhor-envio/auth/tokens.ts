import { 
    getMelhorEnvioClientId, 
    getMelhorEnvioClientSecret, 
    getMelhorEnvioRedirectUri, 
    getMelhorEnvioScopes, 
    getMelhorEnvioEnvironment,
    getMelhorEnvioBaseUrl
} from "../config"
import { buildTokenExpiry } from "../utils"
import { getStoredIntegration, persistIntegration } from "../storage"
import { tokenRequest, fetchMelhorEnvioAccountProfile } from "./client"
import type { Json } from "@/lib/supabase/database.types"

const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000

export function buildMelhorEnvioAuthorizeUrl(state: string, environment = getMelhorEnvioEnvironment()) {
    const authorizeUrl = new URL(`${getMelhorEnvioBaseUrl(environment)}/oauth/authorize`)
    authorizeUrl.searchParams.set("client_id", getMelhorEnvioClientId())
    authorizeUrl.searchParams.set("redirect_uri", getMelhorEnvioRedirectUri())
    authorizeUrl.searchParams.set("response_type", "code")
    authorizeUrl.searchParams.set("state", state)
    authorizeUrl.searchParams.set("scope", getMelhorEnvioScopes())
    return authorizeUrl.toString()
}

export async function exchangeMelhorEnvioCode(code: string, environment = getMelhorEnvioEnvironment()) {
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: getMelhorEnvioClientId(),
        client_secret: getMelhorEnvioClientSecret(),
        redirect_uri: getMelhorEnvioRedirectUri(),
        code,
    })
    return tokenRequest(body, environment)
}

export async function refreshMelhorEnvioToken(refreshToken: string, environment = getMelhorEnvioEnvironment()) {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: getMelhorEnvioClientId(),
        client_secret: getMelhorEnvioClientSecret(),
        refresh_token: refreshToken,
    })
    return tokenRequest(body, environment)
}

export async function saveMelhorEnvioTokensFromCode(code: string, environment = getMelhorEnvioEnvironment()) {
    const tokenPayload = await exchangeMelhorEnvioCode(code, environment)
    const accountProfile = await fetchMelhorEnvioAccountProfile(tokenPayload.access_token, environment)

    await persistIntegration({
        environment,
        access_token: tokenPayload.access_token,
        refresh_token: tokenPayload.refresh_token,
        expires_at: buildTokenExpiry(tokenPayload.expires_in),
        token_type: tokenPayload.token_type || "Bearer",
        scope: tokenPayload.scope || getMelhorEnvioScopes(),
        account_email: accountProfile.email,
        account_name: accountProfile.name,
        metadata: (accountProfile.raw || {}) as Json,
    })
}

export async function getValidAccessToken(environment = getMelhorEnvioEnvironment()) {
    const integration = await getStoredIntegration(environment)

    if (!integration?.refresh_token) {
        throw new Error("Conecte sua conta do Melhor Envio no painel para calcular fretes.")
    }

    const expiresAt = integration.expires_at ? new Date(integration.expires_at).getTime() : 0
    const isTokenFresh = expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS

    if (integration.access_token && isTokenFresh) {
        return integration.access_token
    }

    const refreshedToken = await refreshMelhorEnvioToken(integration.refresh_token, environment)

    await persistIntegration({
        environment,
        access_token: refreshedToken.access_token,
        refresh_token: refreshedToken.refresh_token,
        expires_at: buildTokenExpiry(refreshedToken.expires_in),
        token_type: refreshedToken.token_type || integration.token_type || "Bearer",
        scope: refreshedToken.scope || integration.scope,
        account_email: integration.account_email,
        account_name: integration.account_name,
        metadata: integration.metadata,
    })

    return refreshedToken.access_token
}
