export type MelhorEnvioEnvironment = "sandbox" | "production"

export type ShippingQuoteOption = {
    provider: "melhor_envio"
    postal_code: string
    service_id: string
    service_name: string
    company_name: string
    cost: number
    provider_cost: number
    delivery_days: number
    processing_days: number
    is_free_shipping: boolean
    quote_payload: Record<string, unknown>
}

export type CheckoutShippingSelection = Pick<
    ShippingQuoteOption,
    | "provider"
    | "postal_code"
    | "service_id"
    | "service_name"
    | "company_name"
    | "cost"
    | "provider_cost"
    | "delivery_days"
    | "processing_days"
    | "is_free_shipping"
> & {
    quote_payload?: Record<string, unknown>
}

export type MelhorEnvioIntegrationStatus = {
    connected: boolean
    environment: MelhorEnvioEnvironment
    expires_at: string | null
    connected_at: string | null
    account_email: string | null
    account_name: string | null
}
