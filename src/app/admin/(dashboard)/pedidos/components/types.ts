export type Order = {
    id: string
    total_amount: number
    status: string
    customer_email: string | null
    customer_name: string | null
    created_at: string
    payment_provider?: string | null
    payment_receipt_url?: string | null
    shipping_company_name?: string | null
    shipping_external_id?: string | null
    shipping_provider?: string | null
    shipping_status_detail?: string | null
    shipping_service_name?: string | null
    shipping_tracking_url?: string | null
    order_items: { id: string; quantity: number; price: number; products: { name: string } | null }[]
}

export const STATUS_META: Record<string, { label: string; tone: string }> = {
    paid: {
        label: "Pago",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    processing: {
        label: "Preparando",
        tone: "border-amber-200 bg-amber-50 text-amber-700",
    },
    shipped: {
        label: "Enviado",
        tone: "border-sky-200 bg-sky-50 text-sky-700",
    },
    delivered: {
        label: "Entregue",
        tone: "border-zinc-200 bg-zinc-100 text-zinc-700",
    },
    disputed: {
        label: "Em disputa",
        tone: "border-rose-200 bg-rose-50 text-rose-700",
    },
    cancelled: {
        label: "Cancelado",
        tone: "border-zinc-200 bg-zinc-100 text-zinc-600",
    },
    refunded: {
        label: "Reembolsado",
        tone: "border-purple-200 bg-purple-50 text-purple-700",
    },
}

export const STATUS_OPTIONS = [
    { value: "paid", label: "Pago" },
    { value: "processing", label: "Processando" },
    { value: "shipped", label: "Enviado" },
    { value: "delivered", label: "Entregue" },
    { value: "disputed", label: "Em disputa" },
    { value: "cancelled", label: "Cancelado" },
    { value: "refunded", label: "Reembolsado" },
]

export function getStatusMeta(status: string) {
    return STATUS_META[status] || {
        label: status,
        tone: "border-zinc-200 bg-zinc-50 text-zinc-600",
    }
}
