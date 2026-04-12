'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { updateOrderStatus } from '../actions'

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
            toast.success('Status do pedido atualizado.')
        } catch (error) {
            console.error('Erro ao alterar status:', error)
            toast.error('Não foi possível atualizar o status do pedido.')
        } finally {
            setUpdating(null)
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Itens / Pagamento</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => {
                    const clientName = order.customer_name || 'Cliente'
                    const clientEmail = order.customer_email || 'E-mail não informado'
                    const providerLabel = order.payment_provider || (order.payment_receipt_url ? 'abacatepay' : 'legado')
                    const shippingLabel = [order.shipping_company_name, order.shipping_service_name].filter(Boolean).join(' - ')
                    const isUpdating = updating === order.id

                    return (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">
                                {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{clientName}</div>
                                <div className="text-sm text-muted-foreground">{clientEmail}</div>
                            </TableCell>
                            <TableCell>
                                <div className="max-w-[220px] space-y-1 text-sm">
                                    <div className="text-balance text-sm">
                                        {order.order_items?.map((item) => `${item.quantity}x ${item.products?.name || 'Item'}`).join(', ') || 'Nenhum item'}
                                    </div>
                                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                        {providerLabel}
                                    </div>
                                    {shippingLabel && (
                                        <div className="text-xs text-muted-foreground">
                                            Frete: {shippingLabel}
                                        </div>
                                    )}
                                    {order.payment_receipt_url && (
                                        <a
                                            href={order.payment_receipt_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Ver recibo
                                        </a>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {formatCurrency(order.total_amount)}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(value) => handleStatusChange(order.id, value)}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger className="w-[160px]">
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
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
    )
}
