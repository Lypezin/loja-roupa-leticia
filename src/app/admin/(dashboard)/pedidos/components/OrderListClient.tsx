'use client'

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { updateOrderStatus } from "../actions"

type Order = {
    id: string
    total_amount: number
    status: string
    customer_email: string | null
    customer_name: string | null
    created_at: string
    payment_provider?: string | null
    payment_receipt_url?: string | null
    shipping_company_name?: string | null
    shipping_service_name?: string | null
    order_items: { id: string; quantity: number; price: number; products: { name: string } | null }[]
}

export default function OrderListClient({ orders }: { orders: Order[] }) {
    const [updating, setUpdating] = useState<string | null>(null)

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            setUpdating(orderId)
            await updateOrderStatus(orderId, newStatus)
            toast.success("Status do pedido atualizado.")
        } catch (error) {
            console.error("Erro ao alterar status:", error)
            toast.error("Não foi possível atualizar o status do pedido.")
        } finally {
            setUpdating(null)
        }
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-zinc-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="py-4 pl-6 text-xs font-semibold text-zinc-500">Data</TableHead>
                        <TableHead className="py-4 text-xs font-semibold text-zinc-500">Cliente</TableHead>
                        <TableHead className="py-4 text-xs font-semibold text-zinc-500">Itens e pagamento</TableHead>
                        <TableHead className="py-4 text-xs font-semibold text-zinc-500">Total</TableHead>
                        <TableHead className="py-4 pr-6 text-xs font-semibold text-zinc-500">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const clientName = order.customer_name || "Cliente"
                        const clientEmail = order.customer_email || "E-mail não informado"
                        const providerLabel = order.payment_provider || (order.payment_receipt_url ? "abacatepay" : "legado")
                        const shippingLabel = [order.shipping_company_name, order.shipping_service_name].filter(Boolean).join(" • ")
                        const isUpdating = updating === order.id

                        return (
                            <TableRow key={order.id} className="transition-colors hover:bg-zinc-50/70">
                                <TableCell className="py-4 pl-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-zinc-950">
                                            {new Date(order.created_at).toLocaleDateString("pt-BR")}
                                        </p>
                                        <p className="text-xs font-medium text-zinc-500">
                                            {new Date(order.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-zinc-950">{clientName}</div>
                                        <div className="text-sm text-zinc-600">{clientEmail}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="max-w-[260px] space-y-2 text-sm">
                                        <div className="text-balance leading-6 text-zinc-700">
                                            {order.order_items?.map((item) => `${item.quantity}x ${item.products?.name || "Item"}`).join(", ") || "Nenhum item"}
                                        </div>
                                        <div className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                                            {providerLabel}
                                        </div>
                                        {shippingLabel && (
                                            <div className="text-xs leading-5 text-zinc-500">
                                                Frete: {shippingLabel}
                                            </div>
                                        )}
                                        {order.payment_receipt_url && (
                                            <a
                                                href={order.payment_receipt_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="cursor-pointer text-xs font-medium text-primary hover:underline"
                                            >
                                                Ver recibo
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="text-sm font-semibold text-zinc-950">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 pr-6">
                                    <div className="space-y-2">
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(value) => handleStatusChange(order.id, value)}
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger className="h-10 w-[180px] rounded-md border-zinc-200 bg-zinc-50/70">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="paid">Pago</SelectItem>
                                                <SelectItem value="processing">Processando</SelectItem>
                                                <SelectItem value="shipped">Enviado</SelectItem>
                                                <SelectItem value="delivered">Entregue</SelectItem>
                                                <SelectItem value="disputed">Em disputa</SelectItem>
                                                <SelectItem value="cancelled">Cancelado</SelectItem>
                                                <SelectItem value="refunded">Reembolsado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isUpdating ? (
                                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Salvando...
                                            </span>
                                        ) : null}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
