'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CircleAlert, ExternalLink, Loader2, PackageCheck, ReceiptText, Truck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { createShipmentDraft, syncShipment, updateOrderStatus } from "../actions"

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

interface OrderTableRowProps {
    order: Order
}

const STATUS_META: Record<string, { label: string; tone: string }> = {
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

const STATUS_OPTIONS = [
    { value: "paid", label: "Pago" },
    { value: "processing", label: "Processando" },
    { value: "shipped", label: "Enviado" },
    { value: "delivered", label: "Entregue" },
    { value: "disputed", label: "Em disputa" },
    { value: "cancelled", label: "Cancelado" },
    { value: "refunded", label: "Reembolsado" },
]

function getStatusMeta(status: string) {
    return STATUS_META[status] || {
        label: status,
        tone: "border-zinc-200 bg-zinc-50 text-zinc-600",
    }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
    const [updating, setUpdating] = useState(false)
    const [shippingBusy, setShippingBusy] = useState(false)
    const [nextStatus, setNextStatus] = useState(order.status)
    const router = useRouter()

    const handleStatusChange = async () => {
        try {
            setUpdating(true)
            await updateOrderStatus(order.id, nextStatus)
            toast.success("Status do pedido atualizado.")
            router.refresh()
        } catch (error) {
            console.error("Erro ao alterar status:", error)
            toast.error("Não foi possível atualizar o status do pedido.")
        } finally {
            setUpdating(false)
        }
    }

    const handleCreateShipment = async () => {
        try {
            setShippingBusy(true)
            const shipment = await createShipmentDraft(order.id)
            toast.success(`Etiqueta emitida no Melhor Envio${shipment?.protocol ? ` (${shipment.protocol})` : ""}.`)
            router.refresh()
        } catch (error) {
            console.error("Erro ao emitir etiqueta:", error)
            toast.error(error instanceof Error ? error.message : "Não foi possível emitir a etiqueta.")
        } finally {
            setShippingBusy(false)
        }
    }

    const handleSyncShipment = async () => {
        try {
            setShippingBusy(true)
            const shipment = await syncShipment(order.id)
            toast.success(`Envio sincronizado${shipment?.statusDetail ? `: ${shipment.statusDetail}` : "."}`)
            router.refresh()
        } catch (error) {
            console.error("Erro ao sincronizar envio:", error)
            toast.error(error instanceof Error ? error.message : "Não foi possível sincronizar o envio.")
        } finally {
            setShippingBusy(false)
        }
    }

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
                    {canManageMelhorEnvio ? (
                        <div className="flex flex-wrap gap-2">
                            {!order.shipping_external_id ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-full px-3 text-xs"
                                    disabled={shippingBusy}
                                    onClick={handleCreateShipment}
                                >
                                    {shippingBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
                                    Emitir etiqueta
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-full px-3 text-xs"
                                    disabled={shippingBusy}
                                    onClick={handleSyncShipment}
                                >
                                    {shippingBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Truck className="h-3.5 w-3.5" />}
                                    Sincronizar envio
                                </Button>
                            )}
                            {order.shipping_tracking_url && (
                                <a
                                    href={order.shipping_tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-8 items-center gap-1 rounded-full border border-zinc-200 px-3 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Rastreio
                                </a>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-zinc-500">
                            Sem ação logística pendente no momento.
                        </p>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-5 pr-6 align-top">
                <div className="space-y-3">
                    <span className="block text-sm font-semibold text-zinc-950">
                        {formatCurrency(order.total_amount)}
                    </span>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm" className="h-8 rounded-full px-3 text-xs">
                                Ajustar exceção
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Ajustar status manualmente</DialogTitle>
                                <DialogDescription>
                                    Use isso só para exceções operacionais, como disputa, cancelamento, reembolso ou correção após falha externa.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">
                                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                                    <p className="font-medium text-zinc-900">{clientName}</p>
                                    <p>{order.id}</p>
                                </div>

                                <Select value={nextStatus} onValueChange={setNextStatus} disabled={updating}>
                                    <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="button" onClick={handleStatusChange} disabled={updating || nextStatus === order.status}>
                                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    Salvar ajuste
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </TableCell>
        </TableRow>
    )
}
