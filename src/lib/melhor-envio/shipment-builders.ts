import { normalizeBrazilPhone, normalizeCpf } from "@/lib/customer-profile"
import type { CustomerProfile } from "@/lib/customer-profile"
import {
    MelhorEnvioOrderRecord,
    MelhorEnvioShipmentSnapshot,
    MelhorEnvioStoreSettings,
} from "./shipment-types"
import {
    asJson,
    digitsOnly,
    isRecord,
    normalizeDocument,
    normalizePhone,
    normalizeState,
    readOptionalString,
    readShippingAddress,
    resolveShipmentRecord,
} from "./shipment-utils"

export function buildShipmentSnapshot(payload: unknown): MelhorEnvioShipmentSnapshot {
    const record = resolveShipmentRecord(payload)
    const labels = record && Array.isArray(record.labels) ? record.labels.filter((item) => isRecord(item)) : []
    const tags = record && Array.isArray(record.tags) ? record.tags.filter((item) => isRecord(item)) : []
    const eventStatus = isRecord(payload)
        ? readOptionalString(payload.event)?.replace(/^order\./, "") || null
        : null

    return {
        externalId: record ? readOptionalString(record.id) : null,
        protocol: record ? readOptionalString(record.protocol) : null,
        statusDetail: record ? readOptionalString(record.status) || eventStatus : eventStatus,
        trackingCode: record ? readOptionalString(record.tracking) || readOptionalString(record.self_tracking) : null,
        trackingUrl: record ? readOptionalString(record.tracking_url) : null,
        labelUrl: record
            ? readOptionalString(record.label_url)
                || (labels.length > 0 ? readOptionalString(labels[0].url) : null)
                || (tags.length > 0 ? readOptionalString(tags[0].url) : null)
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

export function mergeShipmentSnapshots(...snapshots: Array<MelhorEnvioShipmentSnapshot | null | undefined>): MelhorEnvioShipmentSnapshot {
    const validSnapshots = snapshots.filter((snapshot): snapshot is MelhorEnvioShipmentSnapshot => Boolean(snapshot))

    return {
        externalId: validSnapshots.map((snapshot) => snapshot.externalId).find(Boolean) || null,
        protocol: validSnapshots.map((snapshot) => snapshot.protocol).find(Boolean) || null,
        statusDetail: validSnapshots.map((snapshot) => snapshot.statusDetail).find(Boolean) || null,
        trackingCode: validSnapshots.map((snapshot) => snapshot.trackingCode).find(Boolean) || null,
        trackingUrl: validSnapshots.map((snapshot) => snapshot.trackingUrl).find(Boolean) || null,
        labelUrl: validSnapshots.map((snapshot) => snapshot.labelUrl).find(Boolean) || null,
        createdAt: validSnapshots.map((snapshot) => snapshot.createdAt).find(Boolean) || null,
        paidAt: validSnapshots.map((snapshot) => snapshot.paidAt).find(Boolean) || null,
        generatedAt: validSnapshots.map((snapshot) => snapshot.generatedAt).find(Boolean) || null,
        postedAt: validSnapshots.map((snapshot) => snapshot.postedAt).find(Boolean) || null,
        deliveredAt: validSnapshots.map((snapshot) => snapshot.deliveredAt).find(Boolean) || null,
        canceledAt: validSnapshots.map((snapshot) => snapshot.canceledAt).find(Boolean) || null,
        payload: validSnapshots.at(-1)?.payload || validSnapshots[0]?.payload || null,
    }
}

export function buildProducts(order: MelhorEnvioOrderRecord) {
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

export function buildVolumes(order: MelhorEnvioOrderRecord) {
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

export function buildSender(settings: MelhorEnvioStoreSettings | null) {
    if (!settings) {
        throw new Error("As configurações da loja não foram encontradas.")
    }

    const document = normalizeDocument(settings.shipping_sender_document || "")
    const phone = normalizePhone(settings.shipping_sender_phone || "")
    const state = normalizeState(settings.shipping_sender_state || "")
    const postalCode = settings.shipping_origin_zip ? digitsOnly(settings.shipping_origin_zip) : null

    if (!settings.shipping_sender_name || !settings.shipping_sender_email || !phone || !document || !settings.shipping_sender_address || !settings.shipping_sender_number || !settings.shipping_sender_district || !settings.shipping_sender_city || !state || !postalCode) {
        throw new Error("Complete os dados do remetente e o CEP de origem em Configurações > Logística antes de emitir a etiqueta.")
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

export function buildRecipient(order: MelhorEnvioOrderRecord, profile: CustomerProfile | null) {
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

export function buildCartPayload(order: MelhorEnvioOrderRecord, settings: MelhorEnvioStoreSettings | null, profile: CustomerProfile | null) {
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
