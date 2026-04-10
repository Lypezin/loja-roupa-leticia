import { getSiteUrl } from "@/lib/site-url"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import type { Database } from "@/lib/supabase/database.types"
import type { ValidatedCheckoutItem } from "@/types/checkout"
import type {
    MelhorEnvioEnvironment,
    MelhorEnvioIntegrationStatus,
    ShippingQuoteOption,
} from "@/types/shipping"

const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000

type MelhorEnvioTokenResponse = {
    access_token: string
    refresh_token: string
    expires_in: number
    token_type?: string
    scope?: string
}

type MelhorEnvioIntegrationRow = Database["public"]["Tables"]["shipping_integrations"]["Row"]

function normalizePositiveNumber(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value
    }

    if (typeof value === "string") {
        const normalized = Number.parseFloat(value.replace(",", "."))
        return Number.isFinite(normalized) ? normalized : null
    }

    return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

function isMelhorEnvioErrorPayload(value: unknown): value is { message?: string; error?: string } {
    if (!isRecord(value)) {
        return false
    }

    return typeof value.message === "string" || typeof value.error === "string"
}

function parseMelhorEnvioEnvironment(value: string | undefined): MelhorEnvioEnvironment {
    return value?.trim().toLowerCase() === "production" ? "production" : "sandbox"
}

function getMelhorEnvioClientId() {
    const clientId = process.env.MELHOR_ENVIO_CLIENT_ID?.trim()

    if (!clientId) {
        throw new Error("MELHOR_ENVIO_CLIENT_ID ausente.")
    }

    return clientId
}

function getMelhorEnvioClientSecret() {
    const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET?.trim()

    if (!clientSecret) {
        throw new Error("MELHOR_ENVIO_CLIENT_SECRET ausente.")
    }

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

function getMelhorEnvioRedirectUri() {
    const configuredRedirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI?.trim()

    if (configuredRedirectUri) {
        return configuredRedirectUri
    }

    return `${getSiteUrl()}/api/integrations/melhor-envio/callback`
}

function getMelhorEnvioScopes() {
    const configuredScopes = process.env.MELHOR_ENVIO_SCOPES?.trim()

    if (!configuredScopes) {
        return "shipping-calculate"
    }

    return configuredScopes
}

function buildMelhorEnvioUserAgent(storeName?: string | null, supportEmail?: string | null) {
    const configuredUserAgent = process.env.MELHOR_ENVIO_USER_AGENT?.trim()

    if (configuredUserAgent) {
        return configuredUserAgent
    }

    const normalizedName = storeName?.trim() || "LS Store Vendas Online"
    const normalizedEmail = supportEmail?.trim() || "suporte@loja-roupa-leticia.local"
    return `${normalizedName} (${normalizedEmail})`
}

function getServiceFilter() {
    const configuredServices = process.env.MELHOR_ENVIO_SERVICE_CODES?.trim()

    return configuredServices || undefined
}

function buildTokenExpiry(expiresInSeconds: number | null | undefined) {
    const expiresIn = typeof expiresInSeconds === "number" && expiresInSeconds > 0
        ? expiresInSeconds
        : 30 * 24 * 60 * 60

    return new Date(Date.now() + expiresIn * 1000).toISOString()
}

async function getStoredIntegration(environment = getMelhorEnvioEnvironment()) {
    const supabase = createServiceRoleClient("melhor-envio.get-integration")

    const { data, error } = await supabase
        .from("shipping_integrations")
        .select("*")
        .eq("provider", "melhor_envio")
        .eq("environment", environment)
        .maybeSingle()

    if (error) {
        throw new Error(`Falha ao carregar integração do Melhor Envio: ${error.message}`)
    }

    return data
}

async function persistIntegration(
    integration: Pick<
        MelhorEnvioIntegrationRow,
        | "environment"
        | "access_token"
        | "refresh_token"
        | "expires_at"
        | "token_type"
        | "scope"
        | "account_email"
        | "account_name"
        | "metadata"
    >,
) {
    const supabase = createServiceRoleClient("melhor-envio.persist-integration")

    const { error } = await supabase
        .from("shipping_integrations")
        .upsert({
            provider: "melhor_envio",
            updated_at: new Date().toISOString(),
            ...integration,
        }, {
            onConflict: "provider,environment",
        })

    if (error) {
        throw new Error(`Falha ao salvar tokens do Melhor Envio: ${error.message}`)
    }
}

async function tokenRequest(
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

    await persistIntegration({
        environment,
        access_token: tokenPayload.access_token,
        refresh_token: tokenPayload.refresh_token,
        expires_at: buildTokenExpiry(tokenPayload.expires_in),
        token_type: tokenPayload.token_type || "Bearer",
        scope: tokenPayload.scope || getMelhorEnvioScopes(),
        account_email: null,
        account_name: null,
        metadata: {},
    })
}

async function getValidAccessToken(environment = getMelhorEnvioEnvironment()) {
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

export async function getMelhorEnvioIntegrationStatus(
    environment = getMelhorEnvioEnvironment(),
): Promise<MelhorEnvioIntegrationStatus> {
    const integration = await getStoredIntegration(environment)

    return {
        connected: Boolean(integration?.refresh_token),
        environment,
        expires_at: integration?.expires_at || null,
        connected_at: integration?.created_at || null,
        account_email: integration?.account_email || null,
        account_name: integration?.account_name || null,
    }
}

export async function disconnectMelhorEnvioIntegration(environment = getMelhorEnvioEnvironment()) {
    const supabase = createServiceRoleClient("melhor-envio.disconnect")

    const { error } = await supabase
        .from("shipping_integrations")
        .delete()
        .eq("provider", "melhor_envio")
        .eq("environment", environment)

    if (error) {
        throw new Error(`Falha ao desconectar o Melhor Envio: ${error.message}`)
    }
}

async function melhorEnvioRequest<T>(
    path: string,
    init: RequestInit,
    options?: {
        environment?: MelhorEnvioEnvironment
        storeName?: string | null
        supportEmail?: string | null
        retrying?: boolean
    },
) {
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

type MelhorEnvioQuoteResponseItem = {
    id?: number | string
    name?: string
    company?: {
        id?: number | string
        name?: string
    } | null
    price?: string | number | null
    custom_price?: string | number | null
    delivery_time?: number | string | null
    custom_delivery_time?: number | string | null
    error?: string | null
    [key: string]: unknown
}

type CalculateQuotesArgs = {
    originPostalCode: string
    destinationPostalCode: string
    subtotal: number
    freeShippingThreshold: number | null
    processingDays: number | null
    items: ValidatedCheckoutItem[]
    storeName?: string | null
    supportEmail?: string | null
}

export async function calculateMelhorEnvioShippingQuotes({
    originPostalCode,
    destinationPostalCode,
    subtotal,
    freeShippingThreshold,
    processingDays,
    items,
    storeName,
    supportEmail,
}: CalculateQuotesArgs): Promise<ShippingQuoteOption[]> {
    const services = getServiceFilter()

    const payload = {
        from: {
            postal_code: originPostalCode.replace(/\D/g, ""),
        },
        to: {
            postal_code: destinationPostalCode.replace(/\D/g, ""),
        },
        products: items.map((item) => ({
            id: `${item.product_id}:${item.variation_id}`,
            width: item.width_cm,
            height: item.height_cm,
            length: item.length_cm,
            weight: item.weight_kg,
            insurance_value: Number(item.unit_price.toFixed(2)),
            quantity: item.quantity,
        })),
        options: {
            receipt: false,
            own_hand: false,
        },
        ...(services ? { services } : {}),
    }

    const response = await melhorEnvioRequest<MelhorEnvioQuoteResponseItem[]>(
        "/api/v2/me/shipment/calculate",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        {
            storeName,
            supportEmail,
        },
    )

    const normalizedProcessingDays = Math.max(0, processingDays ?? 0)

    const options = response
        .filter((service) => !service.error)
        .map((service) => {
            const providerPrice = normalizePositiveNumber(service.custom_price)
                ?? normalizePositiveNumber(service.price)
            const providerDeliveryDays = normalizePositiveNumber(service.custom_delivery_time)
                ?? normalizePositiveNumber(service.delivery_time)
            const serviceId = service.id == null ? null : String(service.id)
            const serviceName = typeof service.name === "string" ? service.name.trim() : ""

            if (!providerPrice || !providerDeliveryDays || !serviceId || !serviceName) {
                return null
            }

            const companyName = service.company && typeof service.company.name === "string"
                ? service.company.name.trim()
                : "Transportadora"

            return {
                provider: "melhor_envio" as const,
                postal_code: destinationPostalCode,
                service_id: serviceId,
                service_name: serviceName,
                company_name: companyName,
                cost: Number(providerPrice.toFixed(2)),
                provider_cost: Number(providerPrice.toFixed(2)),
                delivery_days: Math.ceil(providerDeliveryDays + normalizedProcessingDays),
                processing_days: normalizedProcessingDays,
                is_free_shipping: false,
                quote_payload: service as Record<string, unknown>,
            }
        })
        .filter((service): service is ShippingQuoteOption => Boolean(service))
        .sort((a, b) => a.cost - b.cost || a.delivery_days - b.delivery_days)

    if (options.length === 0) {
        throw new Error("Nenhuma opção de frete disponível para esse CEP.")
    }

    if (freeShippingThreshold !== null && subtotal >= freeShippingThreshold) {
        const [cheapestOption] = options

        return [{
            ...cheapestOption,
            cost: 0,
            is_free_shipping: true,
        }]
    }

    return options
}
