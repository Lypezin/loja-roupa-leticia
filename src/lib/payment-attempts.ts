import { createHash, randomBytes } from "node:crypto"
import type { Json } from "@/lib/supabase/database.types"
import type { ValidatedCheckoutItem } from "@/types/checkout"
import type { CheckoutShippingSelection } from "@/types/shipping"

type AttemptFingerprintRow = {
    trusted_items: Json
    total_amount: number
    shipping_address: Json | null
    shipping_service_id: string | null
    shipping_service_name: string | null
    shipping_company_name: string | null
    shipping_cost: number | null
    shipping_provider_cost: number | null
    shipping_delivery_days: number | null
}

function isJsonObject(value: Json | null | undefined): value is Record<string, Json> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function normalizeMoney(value: number | null | undefined) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return 0
    }

    return Number(value.toFixed(2))
}

function normalizePostalCode(value: Json | string | null | undefined) {
    if (typeof value !== "string") {
        return null
    }

    const normalized = value.replace(/\D/g, "")
    return normalized.length === 8 ? normalized : null
}

function sortObjectKeys(value: Json): Json {
    if (Array.isArray(value)) {
        return value.map(sortObjectKeys)
    }

    if (!isJsonObject(value)) {
        return value
    }

    return Object.keys(value)
        .sort()
        .reduce<Record<string, Json>>((result, key) => {
            const nestedValue = value[key]

            if (typeof nestedValue !== "undefined") {
                result[key] = sortObjectKeys(nestedValue)
            }

            return result
        }, {})
}

function parseAttemptItems(items: Json | ValidatedCheckoutItem[]) {
    if (!Array.isArray(items)) {
        return []
    }

    return items
        .map((item) => {
            if (typeof item !== "object" || item === null) {
                return null
            }

            const candidate = item as Record<string, unknown>
            const productId = typeof candidate.product_id === "string" ? candidate.product_id : null
            const variationId = typeof candidate.variation_id === "string" ? candidate.variation_id : null
            const quantity = typeof candidate.quantity === "number" && Number.isFinite(candidate.quantity) ? candidate.quantity : null
            const unitPrice = typeof candidate.unit_price === "number" && Number.isFinite(candidate.unit_price) ? candidate.unit_price : null

            if (!productId || !variationId || !quantity || unitPrice === null) {
                return null
            }

            return {
                product_id: productId,
                variation_id: variationId,
                quantity,
                unit_price: normalizeMoney(unitPrice),
            }
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .sort((left, right) => {
            const leftKey = `${left.product_id}:${left.variation_id}`
            const rightKey = `${right.product_id}:${right.variation_id}`
            return leftKey.localeCompare(rightKey)
        })
}

function buildFingerprintPayload(params: {
    items: Json | ValidatedCheckoutItem[]
    totalAmount: number
    shippingAddress: Json | null
    shippingServiceId: string | null
    shippingServiceName: string | null
    shippingCompanyName: string | null
    shippingCost: number | null
    shippingProviderCost: number | null
    shippingDeliveryDays: number | null
}) {
    const shippingAddress = isJsonObject(params.shippingAddress) ? params.shippingAddress : null

    return sortObjectKeys({
        total_amount: normalizeMoney(params.totalAmount),
        items: parseAttemptItems(params.items),
        shipping: {
            postal_code: normalizePostalCode(shippingAddress?.postal_code),
            service_id: params.shippingServiceId || null,
            service_name: params.shippingServiceName || null,
            company_name: params.shippingCompanyName || null,
            cost: normalizeMoney(params.shippingCost),
            provider_cost: normalizeMoney(params.shippingProviderCost),
            delivery_days: typeof params.shippingDeliveryDays === "number" ? params.shippingDeliveryDays : null,
        },
    })
}

export function buildCheckoutAttemptFingerprint(params: {
    items: ValidatedCheckoutItem[]
    totalAmount: number
    shippingAddress: Json | null
    shippingSelection: CheckoutShippingSelection
}) {
    const payload = buildFingerprintPayload({
        items: params.items,
        totalAmount: params.totalAmount,
        shippingAddress: params.shippingAddress,
        shippingServiceId: params.shippingSelection.service_id,
        shippingServiceName: params.shippingSelection.service_name,
        shippingCompanyName: params.shippingSelection.company_name,
        shippingCost: params.shippingSelection.cost,
        shippingProviderCost: params.shippingSelection.provider_cost,
        shippingDeliveryDays: params.shippingSelection.delivery_days,
    })

    return createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex")
}

export function buildCheckoutAttemptFingerprintFromRow(row: AttemptFingerprintRow) {
    const payload = buildFingerprintPayload({
        items: row.trusted_items,
        totalAmount: row.total_amount,
        shippingAddress: row.shipping_address,
        shippingServiceId: row.shipping_service_id,
        shippingServiceName: row.shipping_service_name,
        shippingCompanyName: row.shipping_company_name,
        shippingCost: row.shipping_cost,
        shippingProviderCost: row.shipping_provider_cost,
        shippingDeliveryDays: row.shipping_delivery_days,
    })

    return createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex")
}

export function generateCheckoutAccessToken() {
    return randomBytes(24).toString("hex")
}

export function hashCheckoutAccessToken(token: string) {
    return createHash("sha256").update(token.trim(), "utf8").digest("hex")
}

export function mergeAttemptRawResponse(
    currentValue: Json | null | undefined,
    patch: Record<string, Json>,
): Json {
    if (!isJsonObject(currentValue)) {
        return sortObjectKeys(patch)
    }

    return sortObjectKeys({
        ...currentValue,
        ...patch,
    })
}
