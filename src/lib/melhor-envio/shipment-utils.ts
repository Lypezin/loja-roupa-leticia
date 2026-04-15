import type { Json } from "@/lib/supabase/database.types"
import { UnknownRecord } from "./shipment-types"

export function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null
}

export function digitsOnly(value: string) {
    return value.replace(/\D/g, "")
}

export function readString(value: unknown) {
    return typeof value === "string" ? value.trim() : ""
}

export function readOptionalString(value: unknown) {
    const normalized = readString(value)
    return normalized || null
}

export function asJson(value: unknown): Json | null {
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

export function normalizeDocument(value: string) {
    const digits = digitsOnly(value)
    return digits.length === 11 || digits.length === 14 ? digits : null
}

export function normalizeState(value: string) {
    const normalized = value.trim().toUpperCase()
    return /^[A-Z]{2}$/.test(normalized) ? normalized : null
}

export function normalizePhone(value: string) {
    const digits = digitsOnly(value)
    return digits.length >= 10 ? digits : null
}

export function resolveShipmentRecord(payload: unknown): UnknownRecord | null {
    if (Array.isArray(payload)) {
        return payload.find((item): item is UnknownRecord => isRecord(item)) || null
    }

    if (!isRecord(payload)) {
        return null
    }

    if (Array.isArray(payload.orders)) {
        return payload.orders.find((item): item is UnknownRecord => isRecord(item)) || null
    }

    if (isRecord(payload.data)) {
        return payload.data
    }

    return payload
}

export function mapShipmentStatusToOrderStatus(detail: string | null, currentStatus: string) {
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
        case "cancelled":
            return "cancelled"
        case "undelivered":
        case "paused":
        case "suspended":
            return currentStatus === "shipped" ? "shipped" : "processing"
        default:
            return currentStatus
    }
}

export function readShippingAddress(value: Json | null) {
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

export function readScopeList(scope: string | null | undefined) {
    return new Set(
        (scope || "")
            .split(/\s+/)
            .map((item) => item.trim())
            .filter(Boolean),
    )
}

export function resolveBatchOrderIds(payload: unknown) {
    if (!isRecord(payload)) {
        return []
    }

    const possibleCollections = [payload.orders, payload.data]

    for (const collection of possibleCollections) {
        if (!Array.isArray(collection)) {
            continue
        }

        const ids = collection
            .map((item) => {
                if (typeof item === "string") {
                    return readOptionalString(item)
                }

                if (isRecord(item)) {
                    return readOptionalString(item.id)
                }

                return null
            })
            .filter((item): item is string => Boolean(item))

        if (ids.length > 0) {
            return ids
        }
    }

    return []
}
