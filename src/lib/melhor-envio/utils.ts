export function normalizePositiveNumber(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value
    }

    if (typeof value === "string") {
        const normalized = Number.parseFloat(value.replace(",", "."))
        return Number.isFinite(normalized) ? normalized : null
    }

    return null
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

export function isMelhorEnvioErrorPayload(value: unknown): value is { message?: string; error?: string } {
    if (!isRecord(value)) {
        return false
    }

    return typeof value.message === "string" || typeof value.error === "string"
}

export function buildMelhorEnvioUserAgent(storeName?: string | null, supportEmail?: string | null) {
    const configuredUserAgent = process.env.MELHOR_ENVIO_USER_AGENT?.trim()

    if (configuredUserAgent) {
        return configuredUserAgent
    }

    const normalizedName = storeName?.trim() || "LS Store Vendas Online"
    const normalizedEmail = supportEmail?.trim() || "suporte@loja-roupa-leticia.local"
    return `${normalizedName} (${normalizedEmail})`
}

export function buildTokenExpiry(expiresInSeconds: number | null | undefined) {
    const expiresIn = typeof expiresInSeconds === "number" && expiresInSeconds > 0
        ? expiresInSeconds
        : 30 * 24 * 60 * 60

    return new Date(Date.now() + expiresIn * 1000).toISOString()
}

export function readOptionalString(record: Record<string, unknown>, key: string) {
    const value = record[key]
    return typeof value === "string" && value.trim() ? value.trim() : null
}

export function buildMelhorEnvioAccountName(payload: Record<string, unknown>) {
    const directName = readOptionalString(payload, "name")

    if (directName) {
        return directName
    }

    const firstName = readOptionalString(payload, "firstname") || readOptionalString(payload, "first_name")
    const lastName = readOptionalString(payload, "lastname") || readOptionalString(payload, "last_name")
    const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim()

    return combinedName || null
}
