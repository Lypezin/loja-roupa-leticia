import type { Json } from '@/lib/supabase/database.types'

export type UnknownRecord = Record<string, unknown>

export type PaymentEventDetails = {
    event: string
    checkoutId: string | null
    externalId: string | null
    transactionId: string | null
    status: string | null
    receiptUrl: string | null
    customerEmail: string | null
    customerName: string | null
    paymentMethod: string | null
    payload: Json
}

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === 'object' && value !== null
}

function readString(source: UnknownRecord | null | undefined, key: string) {
    if (!source) return null
    const value = source[key]
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

function readStringArray(source: UnknownRecord | null | undefined, key: string) {
    if (!source) return []
    const value = source[key]
    if (!Array.isArray(value)) return []
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function toJson(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Json
}

export function extractPaymentEventDetails(payload: unknown): PaymentEventDetails | null {
    if (!isRecord(payload)) return null

    const event = readString(payload, 'event')
    const data = isRecord(payload.data) ? payload.data : null
    const checkoutNode = data && isRecord(data.checkout) ? data.checkout : null
    const billingNode = data && isRecord(data.billing) ? data.billing : null
    const transparentNode = data && isRecord(data.transparent) ? data.transparent : null
    const paymentInfoNode = data && isRecord(data.payment) ? data.payment : null
    const paymentNode = checkoutNode || billingNode || transparentNode || paymentInfoNode || data
    const customerNode = data && isRecord(data.customer) ? data.customer : null
    const billingCustomerNode = billingNode && isRecord(billingNode.customer) ? billingNode.customer : null
    const billingCustomerMetadataNode = billingCustomerNode && isRecord(billingCustomerNode.metadata) ? billingCustomerNode.metadata : null
    const payerInformationNode = data && isRecord(data.payerInformation) ? data.payerInformation : null
    
    const methods = [
        ...readStringArray(paymentNode, 'methods'),
        ...readStringArray(checkoutNode, 'methods'),
        ...readStringArray(transparentNode, 'methods'),
        ...readStringArray(billingNode, 'methods'),
        ...readStringArray(billingNode, 'kind'),
    ]

    if (!event || !paymentNode) return null

    return {
        event,
        checkoutId: readString(paymentNode, 'id'),
        externalId: readString(paymentNode, 'externalId'),
        transactionId:
            readString(paymentInfoNode, 'id')
            || readString(paymentInfoNode, 'transactionId')
            || readString(data, 'transactionId')
            || readString(payload, 'transactionId')
            || readString(paymentNode, 'transactionId')
            || readString(billingNode, 'id'),
        status: readString(paymentNode, 'status'),
        receiptUrl: readString(paymentInfoNode, 'receiptUrl') || readString(paymentNode, 'receiptUrl'),
        customerEmail: readString(customerNode, 'email') || readString(billingCustomerMetadataNode, 'email'),
        customerName: readString(customerNode, 'name') || readString(billingCustomerMetadataNode, 'name'),
        paymentMethod: readString(paymentInfoNode, 'method') || readString(payerInformationNode, 'method') || readString(paymentNode, 'method') || methods[0] || null,
        payload: toJson(payload),
    }
}
