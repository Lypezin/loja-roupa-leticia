import { readCustomerProfile } from "@/lib/customer-profile"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { melhorEnvioRequest } from "./client"
import { getMelhorEnvioEnvironment } from "./config"
import { getStoredIntegration } from "./storage"
import {
    MelhorEnvioOrderRecord,
    MelhorEnvioShipmentSnapshot,
    MelhorEnvioStoreSettings,
} from "./shipment-types"
import {
    mapShipmentStatusToOrderStatus,
    readScopeList,
    resolveBatchOrderIds,
} from "./shipment-utils"
import {
    buildCartPayload,
    buildShipmentSnapshot,
    mergeShipmentSnapshots,
} from "./shipment-builders"

const REQUIRED_PHASE2_SCOPES = [
    "shipping-checkout",
    "shipping-generate",
    "shipping-print",
    "shipping-tracking",
] as const

async function ensureShipmentScopes() {
    const environment = getMelhorEnvioEnvironment()
    const integration = await getStoredIntegration(environment)

    if (!integration) {
        throw new Error(`Conecte o Melhor Envio em ${environment === "production" ? "produção" : "sandbox"} antes de emitir etiquetas.`)
    }

    const grantedScopes = readScopeList(integration.scope)
    const missingScopes = REQUIRED_PHASE2_SCOPES.filter((scope) => !grantedScopes.has(scope))

    if (missingScopes.length > 0) {
        throw new Error(`Reconecte o Melhor Envio no admin para liberar os escopos de etiqueta: ${missingScopes.join(", ")}.`)
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

export async function getRecipientProfile(userId: string | null) {
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

async function checkoutShipment(orderId: string, settings: MelhorEnvioStoreSettings | null) {
    const response = await melhorEnvioRequest<unknown>(
        "/api/v2/me/shipment/checkout",
        {
            method: "POST",
            body: JSON.stringify({ orders: [orderId] }),
        },
        {
            storeName: settings?.store_name,
            supportEmail: settings?.support_email,
        },
    )

    const checkedOutIds = resolveBatchOrderIds(response)

    if (checkedOutIds.length > 0 && !checkedOutIds.includes(orderId)) {
        throw new Error("O Melhor Envio retornou um pedido diferente do solicitado durante o checkout da etiqueta.")
    }

    return response
}

async function generateShipmentLabel(orderId: string, settings: MelhorEnvioStoreSettings | null) {
    const response = await melhorEnvioRequest<unknown>(
        "/api/v2/me/shipment/generate",
        {
            method: "POST",
            body: JSON.stringify({ orders: [orderId] }),
        },
        {
            storeName: settings?.store_name,
            supportEmail: settings?.support_email,
        },
    )

    const generatedIds = resolveBatchOrderIds(response)

    if (generatedIds.length > 0 && !generatedIds.includes(orderId)) {
        throw new Error("O Melhor Envio retornou uma etiqueta diferente da solicitada durante a geração.")
    }

    return response
}

async function printShipmentLabel(orderId: string, settings: MelhorEnvioStoreSettings | null) {
    return melhorEnvioRequest<unknown>(
        "/api/v2/me/shipment/print",
        {
            method: "POST",
            body: JSON.stringify({
                mode: "private",
                orders: [orderId],
            }),
        },
        {
            storeName: settings?.store_name,
            supportEmail: settings?.support_email,
        },
    )
}

async function fetchShipmentSnapshot(orderId: string, settings: MelhorEnvioStoreSettings | null) {
    const response = await melhorEnvioRequest<unknown>(
        `/api/v2/me/orders/${orderId}`,
        { method: "GET" },
        {
            storeName: settings?.store_name,
            supportEmail: settings?.support_email,
        },
    )

    return buildShipmentSnapshot(response)
}

export async function createMelhorEnvioShipmentDraft(orderId: string) {
    await ensureShipmentScopes()

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
    const cartResponse = await melhorEnvioRequest<unknown>(
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

    const cartSnapshot = buildShipmentSnapshot(cartResponse)

    if (!cartSnapshot.externalId) {
        throw new Error("O Melhor Envio não retornou o identificador da etiqueta.")
    }

    const shippingId = cartSnapshot.externalId
    const checkoutResponse = await checkoutShipment(shippingId, settings)
    const generateResponse = await generateShipmentLabel(shippingId, settings)
    const printResponse = await printShipmentLabel(shippingId, settings)
    const syncedSnapshot = await fetchShipmentSnapshot(shippingId, settings)

    const finalSnapshot = mergeShipmentSnapshots(
        cartSnapshot,
        buildShipmentSnapshot(checkoutResponse),
        buildShipmentSnapshot(generateResponse),
        buildShipmentSnapshot(printResponse),
        syncedSnapshot,
    )

    await applyShipmentSnapshot(order.id, order.status, finalSnapshot)
    return finalSnapshot
}

export async function syncMelhorEnvioShipment(orderId: string) {
    await ensureShipmentScopes()

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

    const snapshot = await fetchShipmentSnapshot(order.shipping_external_id, settings)
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
