import type { Database } from "@/lib/supabase/database.types"
import type { ValidatedCheckoutItem } from "@/types/checkout"
import type {
    MelhorEnvioEnvironment,
    MelhorEnvioIntegrationStatus,
    ShippingQuoteOption,
} from "@/types/shipping"

export type MelhorEnvioTokenResponse = {
    access_token: string
    refresh_token: string
    expires_in: number
    token_type?: string
    scope?: string
}

export type MelhorEnvioAccountProfile = {
    email: string | null
    name: string | null
    raw: Record<string, unknown> | null
}

export type MelhorEnvioIntegrationRow = Database["public"]["Tables"]["shipping_integrations"]["Row"]

export type MelhorEnvioQuoteResponseItem = {
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

export type CalculateQuotesArgs = {
    originPostalCode: string
    destinationPostalCode: string
    subtotal: number
    freeShippingThreshold: number | null
    processingDays: number | null
    items: ValidatedCheckoutItem[]
    storeName?: string | null
    supportEmail?: string | null
}

export type {
    MelhorEnvioEnvironment,
    MelhorEnvioIntegrationStatus,
    ShippingQuoteOption,
}
