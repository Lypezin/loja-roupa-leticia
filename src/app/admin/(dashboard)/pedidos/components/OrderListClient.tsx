'use client'

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { OrderTableRow } from "./OrderTableRow"
import type { Order } from "./types"

export default function OrderListClient({ orders }: { orders: Order[] }) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-zinc-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="py-4 pl-6 text-xs font-semibold text-zinc-500">Data</TableHead>
                        <TableHead className="py-4 text-xs font-semibold text-zinc-500">Cliente</TableHead>
                        <TableHead className="py-4 text-xs font-semibold text-zinc-500">Pedido</TableHead>
                        <TableHead className="py-4 text-xs font-semibold text-zinc-500">Expedição</TableHead>
                        <TableHead className="py-4 pr-6 text-xs font-semibold text-zinc-500">Valor e exceções</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <OrderTableRow key={order.id} order={order} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
