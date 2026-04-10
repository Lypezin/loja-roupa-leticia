import { createHmac, timingSafeEqual } from "node:crypto"

const ABACATEPAY_API_BASE_URL = "https://api.abacatepay.com/v1"

export type AbacatePayMethod = "PIX" | "CARD"

type AbacatePayApiResponse<T> = {
    success: boolean
    data: T | null
    error: string | null
}

type AbacatePayBillingCustomer = {
    name: string
    cellphone: string
    email: string
    taxId: string
}

export type AbacatePayBillingProduct = {
    externalId: string
    name: string
    description?: string
    quantity: number
    price: number
}

type CreateBillingPayload = {
    frequency: "ONE_TIME"
    methods: AbacatePayMethod[]
    products: AbacatePayBillingProduct[]
    returnUrl: string
    completionUrl: string
    customer: AbacatePayBillingCustomer
    allowCoupons: boolean
    externalId: string
    metadata?: Record<string, string>
}

export type AbacatePayBilling = {
    id: string
    url: string
    amount?: number | null
    status?: string | null
    methods?: string[] | null
    receiptUrl?: string | null
    externalId?: string | null
    devMode?: boolean
}

function getAbacatePayApiKey() {
    const apiKey = process.env.ABACATEPAY_API_KEY?.trim()

    if (!apiKey) {
        throw new Error("ABACATEPAY_API_KEY ausente.")
    }

    return apiKey
}

export function getAbacatePayMethods() {
    const configuredMethods = process.env.ABACATEPAY_PAYMENT_METHODS?.trim()

    if (!configuredMethods) {
        return ["PIX", "CARD"] satisfies AbacatePayMethod[]
    }

    const methods = configuredMethods
        .split(",")
        .map((method) => method.trim().toUpperCase())
        .filter((method): method is AbacatePayMethod => method === "PIX" || method === "CARD")

    if (methods.length === 0) {
        return ["PIX", "CARD"] satisfies AbacatePayMethod[]
    }

    return methods
}

async function abacatePayRequest<T>(path: string, init: RequestInit) {
    const response = await fetch(`${ABACATEPAY_API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${getAbacatePayApiKey()}`,
            "Content-Type": "application/json",
            ...(init.headers || {}),
        },
        cache: "no-store",
    })

    const payload = await response.json() as AbacatePayApiResponse<T>

    if (!response.ok || !payload.success || !payload.data) {
        const errorMessage = payload.error || `Falha ao chamar a AbacatePay (${response.status}).`
        throw new Error(errorMessage)
    }

    return payload.data
}

export async function createAbacatePayBilling(payload: CreateBillingPayload) {
    return abacatePayRequest<AbacatePayBilling>("/billing/create", {
        method: "POST",
        body: JSON.stringify(payload),
    })
}

export function normalizeAbacatePayStatus(status: string | null | undefined) {
    if (!status) {
        return "pending"
    }

    const normalized = status.toLowerCase()

    if (normalized === "paid" || normalized === "completed" || normalized === "complete") {
        return "completed"
    }

    if (normalized === "refunded") {
        return "refunded"
    }

    if (normalized === "disputed" || normalized === "chargeback") {
        return "disputed"
    }

    if (normalized === "failed" || normalized === "cancelled") {
        return "failed"
    }

    return "pending"
}

export function verifyAbacatePaySignature(rawBody: string, signatureFromHeader: string) {
    const publicKey = process.env.ABACATEPAY_HMAC_PUBLIC_KEY?.trim()

    if (!publicKey || !signatureFromHeader.trim()) {
        return false
    }

    const expectedSignature = createHmac("sha256", publicKey)
        .update(Buffer.from(rawBody, "utf8"))
        .digest("base64")

    const expectedBuffer = Buffer.from(expectedSignature)
    const receivedBuffer = Buffer.from(signatureFromHeader)

    return expectedBuffer.length === receivedBuffer.length
        && timingSafeEqual(expectedBuffer, receivedBuffer)
}
