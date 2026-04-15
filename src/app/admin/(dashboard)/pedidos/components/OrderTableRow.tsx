'use client'

import { CircleAlert, ReceiptText } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

import { Order, getStatusMeta } from "./types"
import { OrderStatusDialog } from "./OrderStatusDialog"
import { OrderShippingActions } from "./OrderShippingActions"

interface OrderTableRowProps {
    order: Order
}

export function OrderTableRow({ order }: OrderTableRowProps) {
    const clientName = order.customer_name || "Cliente"
    const clientEmail = order.customer_email || "E-mail não informado"
    const providerLabel = order.payment_provider || (order.payment_receipt_url ? "abacatepay" : "legado")
    const shippingLabel = [order.shipping_company_name, order.shipping_service_name].filter(Boolean).join(" • ")
    const canManageMelhorEnvio = order.shipping_provider === "melhor_envio" && (order.status === "paid" || order.status === "processing" || order.status === "shipped")
    const statusMeta = getStatusMeta(order.status)
    const hasOperationalAttention = ["disputed", "cancelled", "refunded"].includes(order.status)

    return (
        <TableRow className="transition-colors hover:bg-zinc-50/70">
            <TableCell className="py-5 pl-6 align-top">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-950">
                        {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-xs font-medium text-zinc-500">
                        {new Date(order.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </TableCell>

            <TableCell className="py-5 align-top">
                <div className="space-y-1.5">
                    <div className="font-semibold text-zinc-950">{clientName}</div>
                    <div className="text-sm text-zinc-600">{clientEmail}</div>
                </div>
            </TableCell>

            <TableCell className="py-5 align-top">
                <div className="max-w-[330px] space-y-2.5 text-sm">
                    <div className="text-balance leading-6 text-zinc-700">
                        {order.order_items?.map((item) => `${item.quantity}x ${item.products?.name || "Item"}`).join(", ") || "Nenhum item"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                            {providerLabel}
                        </span>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusMeta.tone}`}>
                            {statusMeta.label}
                        </span>
                    </div>
                    {order.payment_receipt_url && (
                        <a
                            href={order.payment_receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                            <ReceiptText className="h-3.5 w-3.5" />
                            Ver recibo
                        </a>
                    )}
                    {hasOperationalAttention && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                            <CircleAlert className="h-3.5 w-3.5" />
                            Pedido fora do fluxo automático
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-5 align-top">
                <div className="max-w-[280px] space-y-2.5 text-sm">
                    <div className="text-zinc-700">
                        {shippingLabel || "Frete ainda não vinculado ao pedido."}
                    </div>
                    {order.shipping_status_detail && (
                        <div className="text-xs leading-5 text-zinc-500">
                            Status logístico: {order.shipping_status_detail}
                        </div>
                    )}
                    <OrderShippingActions order={order} canManageMelhorEnvio={canManageMelhorEnvio} />
                </div>
            </TableCell>

            <TableCell className="py-5 pr-6 align-top">
                <div className="space-y-3">
                    <span className="block text-sm font-semibold text-zinc-950">
                        {formatCurrency(order.total_amount)}
                    </span>

                    <OrderStatusDialog order={order} clientName={clientName} />
                </div>
            </TableCell>
        </TableRow>
    )
}
