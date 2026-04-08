'use client'

import { useState } from 'react'
import { updateOrderStatus } from '../actions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'

type Order = {
    id: string
    stripe_session_id: string
    total_amount: number
    status: string
    customer_email: string | null
    customer_name: string | null
    created_at: string
    order_items: { id: string, quantity: number, price: number, products: { name: string } | null }[]
}

export default function OrderListClient({ orders }: { orders: Order[] }) {
    const [updating, setUpdating] = useState<string | null>(null)

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            setUpdating(orderId)
            await updateOrderStatus(orderId, newStatus)
        } catch (error) {
            console.error("Erro ao alterar status:", error)
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
                    <TableHead>Itens / Recibo</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => {
                    const clientName = order.customer_name || 'Alguém'
                    const clientEmail = order.customer_email || 'Oculto na Stripe'

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
                                <div className="max-w-[200px] text-balance text-sm">
                                    {order.order_items?.map(i => `${i.quantity}x ${i.products?.name || 'Item'}`).join(', ') || 'Nenhum item'}
                                </div>
                            </TableCell>
                            <TableCell>
                                {formatCurrency(order.total_amount)}
                            </TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={order.status}
                                    onValueChange={(val) => handleStatusChange(order.id, val)}
                                    disabled={updating === order.id}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Pago</SelectItem>
                                        <SelectItem value="processing">Processando</SelectItem>
                                        <SelectItem value="shipped">Enviado</SelectItem>
                                        <SelectItem value="delivered">Entregue</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                        <SelectItem value="refunded">Reembolsado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
