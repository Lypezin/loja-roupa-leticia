import type { Json } from "@/lib/supabase/database.types"

export type UnknownRecord = Record<string, unknown>

export type MelhorEnvioOrderRecord = {
    id: string
    user_id: string | null
    status: string
    customer_email: string | null
    customer_name: string | null
    shipping_provider: string | null
    shipping_service_id: string | null
    shipping_quote_payload: Json | null
    shipping_address: Json | null
    shipping_external_id: string | null
    total_amount: number
    order_items: Array<{
        id: string
        quantity: number
        price: number
        products: {
            name: string
            weight_kg: number | null
            height_cm: number | null
            width_cm: number | null
            length_cm: number | null
        } | null
        product_variations: {
            size: string | null
            color: string | null
        } | null
    }>
}

export type MelhorEnvioStoreSettings = {
    store_name: string
    support_email: string | null
    shipping_origin_zip: string | null
    shipping_sender_name: string | null
    shipping_sender_email: string | null
    shipping_sender_phone: string | null
    shipping_sender_document: string | null
    shipping_sender_state_register: string | null
    shipping_sender_address: string | null
    shipping_sender_number: string | null
    shipping_sender_district: string | null
    shipping_sender_city: string | null
    shipping_sender_state: string | null
    shipping_sender_complement: string | null
    shipping_sender_non_commercial: boolean | null
}

export type MelhorEnvioShipmentSnapshot = {
    externalId: string | null
    protocol: string | null
    statusDetail: string | null
    trackingCode: string | null
    trackingUrl: string | null
    labelUrl: string | null
    createdAt: string | null
    paidAt: string | null
    generatedAt: string | null
    postedAt: string | null
    deliveredAt: string | null
    canceledAt: string | null
    payload: Json | null
}
