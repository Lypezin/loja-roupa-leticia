import { normalizeBrazilPhone, normalizeCpf, readCustomerProfile } from "@/lib/customer-profile"
import type { Json } from "@/lib/supabase/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { melhorEnvioRequest } from "./client"

type UnknownRecord = Record<string, unknown>

type MelhorEnvioOrderRecord = {
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

type MelhorEnvioStoreSettings = {
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

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null
}

function digitsOnly(value: string) {
    return value.replace(/\D/g, "")
}

function readString(value: unknown) {
    return typeof value === "string" ? value.trim() : ""
}

function readOptionalString(value: unknown) {
    const normalized = readString(value)
    return normalized || null
}

function asJson(value: unknown): Json | null {
    if (value === null) {
        return null
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return value
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => asJson(item))
            .filter((item): item is Json => item !== null)
    }

    if (isRecord(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, asJson(item)]),
        ) as Json
    }

    return null
}

function normalizeDocument(value: string) {
    const digits = digitsOnly(value)
    return digits.length === 11 || digits.length === 14 ? digits : null
}

function normalizeState(value: string) {
    const normalized = value.trim().toUpperCase()
    return /^[A-Z]{2}$/.test(normalized) ? normalized : null
}

function normalizePhone(value: string) {
    const digits = digitsOnly(value)
    return digits.length >= 10 ? digits : null
}

function resolveShipmentRecord(payload: unknown): UnknownRecord | null {
    if (Array.isArray(payload)) {
        return payload.find((item): item is UnknownRecord => isRecord(item)) || null
    }

    if (!isRecord(payload)) {
        return null
    }

    if (isRecord(payload.data)) {
        return payload.data
    }

    return payload
}

function buildShipmentSnapshot(payload: unknown): MelhorEnvioShipmentSnapshot {
    const record = resolveShipmentRecord(payload)
    const labels = record && Array.isArray(record.labels) ? record.labels.filter((item) => isRecord(item)) : []

    return {
        externalId: record ? readOptionalString(record.id) : null,
        protocol: record ? readOptionalString(record.protocol) : null,
        statusDetail: record ? readOptionalString(record.status) : null,
        trackingCode: record ? readOptionalString(record.tracking) || readOptionalString(record.self_tracking) : null,
        trackingUrl: record ? readOptionalString(record.tracking_url) : null,
        labelUrl: record
            ? readOptionalString(record.label_url)
                || (labels.length > 0 ? readOptionalString(labels[0].url) : null)
            : null,
        createdAt: record ? readOptionalString(record.created_at) : null,
        paidAt: record ? readOptionalString(record.paid_at) : null,
        generatedAt: record ? readOptionalString(record.generated_at) : null,
        postedAt: record ? readOptionalString(record.posted_at) : null,
        deliveredAt: record ? readOptionalString(record.delivered_at) : null,
        canceledAt: record ? readOptionalString(record.canceled_at) : null,
        payload: asJson(payload),
    }
}

function mapShipmentStatusToOrderStatus(detail: string | null, currentStatus: string) {
    switch (detail) {
        case "created":
        case "pending":
        case "released":
        case "generated":
        case "received":
            return currentStatus === "paid" ? "processing" : currentStatus
        case "posted":
            return "shipped"
        case "delivered":
            return "delivered"
        default:
            return currentStatus
    }
}

function readShippingAddress(value: Json | null) {
    if (!isRecord(value)) {
        return null
    }

    const street = readOptionalString(value.street) || readOptionalString(value.address_street) || readOptionalString(value.line1)
    const number = readOptionalString(value.number) || readOptionalString(value.address_number)
    const neighborhood = readOptionalString(value.neighborhood) || readOptionalString(value.address_neighborhood)
    const complement = readOptionalString(value.complement) || readOptionalString(value.address_complement) || readOptionalString(value.line2)
    const city = readOptionalString(value.city)
    const state = readOptionalString(value.state)
    const postalCode = readOptionalString(value.postal_code)
    const country = readOptionalString(value.country) || "BR"

    if (!street || !number || !neighborhood || !city || !state || !postalCode) {
        return null
    }

    return {
        street,
        number,
        neighborhood,
        complement,
        city,
        state,
        postalCode,
        country,
    }
}

async function getShipmentOrder(orderId: string) {
    const supabase = createServiceRoleClient("melhor-envio.phase2.order")
    const { data, error } = await supabase
        .from("orders")
        .select(`
            id,
            user_id,
            status,
            customer_email,
            customer_name,
            shipping_provider,
            shipping_service_id,
            shipping_quote_payload,
            shipping_address,
            shipping_external_id,
            total_amount,
            order_items (
                id,
                quantity,
                price,
                products (
                    name,
                    weight_kg,
                    height_cm,
                    width_cm,
                    length_cm
                ),
                product_variations (
                    size,
                    color
                )
            )
        `)
        .eq("id", orderId)
        .maybeSingle()

    if (error) {
        throw new Error(`Falha ao carregar o pedido: ${error.message}`)
    }

    return data as MelhorEnvioOrderRecord | null
}

async function getStoreSettings() {
    const supabase = createServiceRoleClient("melhor-envio.phase2.settings")
    const { data, error } = await supabase
        .from("store_settings")
        .select(`
            store_name,
            support_email,
            shipping_origin_zip,
            shipping_sender_name,
            shipping_sender_email,
            shipping_sender_phone,
            shipping_sender_document,
            shipping_sender_state_register,
            shipping_sender_address,
            shipping_sender_number,
            shipping_sender_district,
            shipping_sender_city,
            shipping_sender_state,
            shipping_sender_complement,
            shipping_sender_non_commercial
        `)
        .limit(1)
        .maybeSingle()

    if (error) {
        throw new Error(`Falha ao carregar as configurações da loja: ${error.message}`)
    }

    return data as MelhorEnvioStoreSettings | null
}

async function getRecipientProfile(userId: string | null) {
    if (!userId) {
        return null
    }

    const supabase = createServiceRoleClient("melhor-envio.phase2.customer")
    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error || !data.user) {
        return null
    }

    return readCustomerProfile(data.user)
}

function buildProducts(order: MelhorEnvioOrderRecord) {
    return order.order_items.map((item) => {
        if (!item.products?.name || !item.products.weight_kg || !item.products.height_cm || !item.products.width_cm || !item.products.length_cm) {
            throw new Error("Há itens sem peso e dimensões completos neste pedido.")
        }

        const variationLabel = [item.product_variations?.color, item.product_variations?.size]
            .filter(Boolean)
            .join(" / ")

        return {
            id: item.id,
            name: variationLabel ? `${item.products.name} (${variationLabel})` : item.products.name,
            quantity: item.quantity,
            unitary_value: Number(item.price.toFixed(2)),
            insurance_value: Number((item.price * item.quantity).toFixed(2)),
            weight: item.products.weight_kg,
            width: item.products.width_cm,
            height: item.products.height_cm,
            length: item.products.length_cm,
        }
    })
}

function buildVolumes(order: MelhorEnvioOrderRecord) {
    const quotePayload = isRecord(order.shipping_quote_payload) ? order.shipping_quote_payload : null
    const packages = quotePayload && Array.isArray(quotePayload.packages)
        ? quotePayload.packages.filter((item) => isRecord(item))
        : []

    if (packages.length > 1) {
        throw new Error("Este pedido retornou múltiplos volumes na cotação. Faça a emissão manual desse envio no Melhor Envio.")
    }

    if (packages.length === 1) {
        const currentPackage = packages[0]
        const dimensions = isRecord(currentPackage.dimensions) ? currentPackage.dimensions : null

        return [{
            height: Number(currentPackage.height ?? dimensions?.height ?? 0),
            width: Number(currentPackage.width ?? dimensions?.width ?? 0),
            length: Number(currentPackage.length ?? dimensions?.length ?? 0),
            weight: Number(currentPackage.weight ?? 0),
            insurance_value: Number(currentPackage.insurance_value ?? order.total_amount),
            products: Array.isArray(currentPackage.products) ? currentPackage.products : undefined,
        }]
    }

    const totalWeight = order.order_items.reduce((sum, item) => sum + (Number(item.products?.weight_kg || 0) * item.quantity), 0)
    const maxHeight = Math.max(...order.order_items.map((item) => Number(item.products?.height_cm || 0)))
    const maxWidth = Math.max(...order.order_items.map((item) => Number(item.products?.width_cm || 0)))
    const totalLength = order.order_items.reduce((sum, item) => sum + Number(item.products?.length_cm || 0), 0)

    return [{
        height: Number(maxHeight.toFixed(2)),
        width: Number(maxWidth.toFixed(2)),
        length: Number(totalLength.toFixed(2)),
        weight: Number(totalWeight.toFixed(3)),
        insurance_value: Number(order.total_amount.toFixed(2)),
        products: order.order_items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
        })),
    }]
}

function buildSender(settings: MelhorEnvioStoreSettings | null) {
    if (!settings) {
        throw new Error("As configurações da loja não foram encontradas.")
    }

    const document = normalizeDocument(settings.shipping_sender_document || "")
    const phone = normalizePhone(settings.shipping_sender_phone || "")
    const state = normalizeState(settings.shipping_sender_state || "")
    const postalCode = settings.shipping_origin_zip ? digitsOnly(settings.shipping_origin_zip) : null

    if (!settings.shipping_sender_name || !settings.shipping_sender_email || !phone || !document || !settings.shipping_sender_address || !settings.shipping_sender_number || !settings.shipping_sender_district || !settings.shipping_sender_city || !state || !postalCode) {
        throw new Error("Complete os dados do remetente e o CEP de origem em Configurações > Logística antes de criar a etiqueta.")
    }

    return {
        name: settings.shipping_sender_name,
        email: settings.shipping_sender_email,
        phone,
        postal_code: postalCode,
        address: settings.shipping_sender_address,
        number: settings.shipping_sender_number,
        district: settings.shipping_sender_district,
        city: settings.shipping_sender_city,
        state_abbr: state,
        country_id: "BR",
        complement: settings.shipping_sender_complement || undefined,
        state_register: settings.shipping_sender_state_register || undefined,
        non_commercial: settings.shipping_sender_non_commercial !== false,
        ...(document.length === 11
            ? { document }
            : { company_document: document }),
    }
}

function buildRecipient(order: MelhorEnvioOrderRecord, profile: Awaited<ReturnType<typeof getRecipientProfile>>) {
    const address = readShippingAddress(order.shipping_address)

    if (!address) {
        throw new Error("O pedido não possui um endereço completo suficiente para emitir a etiqueta.")
    }

    const recipientPhone = normalizeBrazilPhone(profile?.phone || "")
    const recipientDocument = normalizeCpf(profile?.cpf || "")
    const state = normalizeState(address.state)

    if (!state) {
        throw new Error("O estado do destinatário está inválido no pedido.")
    }

    if (!recipientPhone || !recipientDocument) {
        throw new Error("O cliente precisa ter telefone e CPF válidos no perfil para emitir a etiqueta.")
    }

    return {
        name: order.customer_name || profile?.fullName || "Cliente",
        email: order.customer_email || profile?.email || undefined,
        phone: digitsOnly(recipientPhone),
        postal_code: digitsOnly(address.postalCode),
        address: address.street,
        number: address.number,
        district: address.neighborhood,
        city: address.city,
        state_abbr: state,
        country_id: address.country,
        complement: address.complement || undefined,
        document: recipientDocument,
    }
}

function buildCartPayload(order: MelhorEnvioOrderRecord, settings: MelhorEnvioStoreSettings | null, profile: Awaited<ReturnType<typeof getRecipientProfile>>) {
    if (order.shipping_provider !== "melhor_envio") {
        throw new Error("Este pedido não usa o Melhor Envio como provedor de frete.")
    }

    if (!order.shipping_service_id) {
        throw new Error("O pedido não possui um serviço de frete selecionado.")
    }

    const service = /^\d+$/.test(order.shipping_service_id)
        ? Number(order.shipping_service_id)
        : order.shipping_service_id

    return {
        service,
        from: buildSender(settings),
        to: buildRecipient(order, profile),
        products: buildProducts(order),
        volumes: buildVolumes(order),
        options: {
            receipt: false,
            own_hand: false,
            non_commercial: settings?.shipping_sender_non_commercial !== false,
        },
    }
}

async function applyShipmentSnapshot(orderId: string, currentStatus: string, snapshot: MelhorEnvioShipmentSnapshot) {
    const supabase = createServiceRoleClient("melhor-envio.phase2.persist")
    const nextStatus = mapShipmentStatusToOrderStatus(snapshot.statusDetail, currentStatus)

    const { error } = await supabase
        .from("orders")
        .update({
            status: nextStatus,
            shipping_external_id: snapshot.externalId,
            shipping_external_protocol: snapshot.protocol,
            shipping_status_detail: snapshot.statusDetail,
            shipping_tracking_code: snapshot.trackingCode,
            shipping_tracking_url: snapshot.trackingUrl,
            shipping_label_url: snapshot.labelUrl,
            shipping_payload: snapshot.payload,
            shipping_created_at: snapshot.createdAt,
            shipping_paid_at: snapshot.paidAt,
            shipping_generated_at: snapshot.generatedAt,
            shipping_posted_at: snapshot.postedAt,
            shipping_delivered_at: snapshot.deliveredAt,
            shipping_canceled_at: snapshot.canceledAt,
            shipping_last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

    if (error) {
        throw new Error(`Falha ao atualizar o envio no pedido: ${error.message}`)
    }
}

export async function createMelhorEnvioShipmentDraft(orderId: string) {
    const [order, settings] = await Promise.all([
        getShipmentOrder(orderId),
        getStoreSettings(),
    ])

    if (!order) {
        throw new Error("Pedido não encontrado.")
    }

    if (order.shipping_external_id) {
        throw new Error("Este pedido já possui uma etiqueta criada no Melhor Envio.")
    }

    const profile = await getRecipientProfile(order.user_id)
    const payload = buildCartPayload(order, settings, profile)
    const response = await melhorEnvioRequest<unknown>(
        "/api/v2/me/cart",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        {
            storeName: settings?.store_name,
            supportEmail: settings?.support_email,
        },
    )

    const snapshot = buildShipmentSnapshot(response)

    if (!snapshot.externalId) {
        throw new Error("O Melhor Envio não retornou o identificador da etiqueta.")
    }

    await applyShipmentSnapshot(order.id, order.status, snapshot)
    return snapshot
}

export async function syncMelhorEnvioShipment(orderId: string) {
    const [order, settings] = await Promise.all([
        getShipmentOrder(orderId),
        getStoreSettings(),
    ])

    if (!order) {
        throw new Error("Pedido não encontrado.")
    }

    if (!order.shipping_external_id) {
        throw new Error("Este pedido ainda não possui uma etiqueta criada no Melhor Envio.")
    }

    const response = await melhorEnvioRequest<unknown>(
        `/api/v2/me/orders/${order.shipping_external_id}`,
        { method: "GET" },
        {
            storeName: settings?.store_name,
            supportEmail: settings?.support_email,
        },
    )

    const snapshot = buildShipmentSnapshot(response)
    await applyShipmentSnapshot(order.id, order.status, snapshot)
    return snapshot
}

export async function applyMelhorEnvioWebhook(payload: unknown) {
    const snapshot = buildShipmentSnapshot(payload)

    if (!snapshot.externalId) {
        return null
    }

    const supabase = createServiceRoleClient("melhor-envio.phase2.webhook")
    const { data: order, error } = await supabase
        .from("orders")
        .select("id, status")
        .eq("shipping_external_id", snapshot.externalId)
        .maybeSingle()

    if (error) {
        throw new Error(`Falha ao localizar pedido do webhook: ${error.message}`)
    }

    if (!order) {
        return null
    }

    await applyShipmentSnapshot(order.id, order.status, snapshot)
    return order.id
}
