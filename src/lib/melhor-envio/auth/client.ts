import { getMelhorEnvioBaseUrl, getMelhorEnvioEnvironment } from "../config"
import { buildMelhorEnvioAccountName, buildMelhorEnvioUserAgent, isRecord, readOptionalString } from "../utils"
import type { MelhorEnvioTokenResponse, MelhorEnvioAccountProfile } from "../types"

export async function tokenRequest(
    body: URLSearchParams,
    environment = getMelhorEnvioEnvironment(),
) {
    const response = await fetch(`${getMelhorEnvioBaseUrl(environment)}/oauth/token`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        cache: "no-store",
    })

    const payload = await response.json().catch(() => null) as MelhorEnvioTokenResponse & { error?: string } | null

    if (!response.ok || !payload?.access_token || !payload?.refresh_token) {
        const errorMessage = payload && "error" in payload && payload.error
            ? payload.error
            : `Falha ao autenticar no Melhor Envio (${response.status}).`
        throw new Error(errorMessage)
    }

    return payload
}

export async function fetchMelhorEnvioAccountProfile(
    accessToken: string,
    environment = getMelhorEnvioEnvironment(),
): Promise<MelhorEnvioAccountProfile> {
    try {
        const response = await fetch(`${getMelhorEnvioBaseUrl(environment)}/api/v2/me`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": buildMelhorEnvioUserAgent(),
            },
            cache: "no-store",
        })

        if (!response.ok) {
            return { email: null, name: null, raw: null }
        }

        const payload = await response.json().catch(() => null) as Record<string, unknown> | null

        if (!payload || !isRecord(payload)) {
            return { email: null, name: null, raw: null }
        }

        return {
            email: readOptionalString(payload, "email"),
            name: buildMelhorEnvioAccountName(payload),
            raw: payload,
        }
    } catch {
        return { email: null, name: null, raw: null }
    }
}
