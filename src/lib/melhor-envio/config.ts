import { getSiteUrl } from "@/lib/site-url"
import type { MelhorEnvioEnvironment } from "./types"

export function parseMelhorEnvioEnvironment(value: string | undefined): MelhorEnvioEnvironment {
    return value?.trim().toLowerCase() === "production" ? "production" : "sandbox"
}

export function getMelhorEnvioClientId() {
    const clientId = process.env.MELHOR_ENVIO_CLIENT_ID?.trim()
    if (!clientId) throw new Error("MELHOR_ENVIO_CLIENT_ID ausente.")
    return clientId
}

export function getMelhorEnvioClientSecret() {
    const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET?.trim()
    if (!clientSecret) throw new Error("MELHOR_ENVIO_CLIENT_SECRET ausente.")
    return clientSecret
}

export function getMelhorEnvioEnvironment() {
    return parseMelhorEnvioEnvironment(process.env.MELHOR_ENVIO_ENVIRONMENT)
}

export function getMelhorEnvioBaseUrl(environment = getMelhorEnvioEnvironment()) {
    return environment === "production"
        ? "https://www.melhorenvio.com.br"
        : "https://sandbox.melhorenvio.com.br"
}

export function getMelhorEnvioRedirectUri() {
    const configuredRedirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI?.trim()
    return configuredRedirectUri || `${getSiteUrl()}/api/integrations/melhor-envio/callback`
}

export function getMelhorEnvioScopes() {
    return process.env.MELHOR_ENVIO_SCOPES?.trim()
        || "shipping-calculate shipping-preview shipping-checkout shipping-generate shipping-print shipping-tracking shipping-companies"
}

export function getServiceFilter() {
    return process.env.MELHOR_ENVIO_SERVICE_CODES?.trim() || undefined
}

export function getMelhorEnvioWebhookSecret() {
    const webhookSecret = process.env.MELHOR_ENVIO_WEBHOOK_SECRET?.trim()

    if (!webhookSecret) {
        throw new Error("MELHOR_ENVIO_WEBHOOK_SECRET ausente.")
    }

    return webhookSecret
}
