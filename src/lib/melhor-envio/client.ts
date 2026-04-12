import { getMelhorEnvioBaseUrl, getMelhorEnvioEnvironment } from "./config"
import { getValidAccessToken, refreshMelhorEnvioToken } from "./auth"
import { getStoredIntegration, persistIntegration } from "./storage"
import { buildMelhorEnvioUserAgent, isMelhorEnvioErrorPayload, buildTokenExpiry } from "./utils"
import type { MelhorEnvioEnvironment } from "./types"

export async function melhorEnvioRequest<T>(
    path: string,
    init: RequestInit,
    options?: {
        environment?: MelhorEnvioEnvironment
        storeName?: string | null
        supportEmail?: string | null
        retrying?: boolean
    },
): Promise<T> {
    const environment = options?.environment || getMelhorEnvioEnvironment()
    const accessToken = await getValidAccessToken(environment)

    const response = await fetch(`${getMelhorEnvioBaseUrl(environment)}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": buildMelhorEnvioUserAgent(options?.storeName, options?.supportEmail),
            ...(init.headers || {}),
        },
        cache: "no-store",
    })

    const payload = await response.json().catch(() => null) as T | { message?: string; error?: string } | null

    if (response.status === 401 && !options?.retrying) {
        const integration = await getStoredIntegration(environment)

        if (!integration?.refresh_token) {
            throw new Error("Conecte novamente o Melhor Envio para continuar.")
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

        return melhorEnvioRequest<T>(path, init, {
            ...options,
            environment,
            retrying: true,
        })
    }

    if (!response.ok || !payload) {
        const errorPayload = isMelhorEnvioErrorPayload(payload) ? payload : null
        const errorMessage = errorPayload
            ? typeof errorPayload.message === "string"
                ? errorPayload.message
                : typeof errorPayload.error === "string"
                    ? errorPayload.error
                    : `Falha ao consultar o Melhor Envio (${response.status}).`
            : `Falha ao consultar o Melhor Envio (${response.status}).`
        throw new Error(errorMessage)
    }

    return payload as T
}
