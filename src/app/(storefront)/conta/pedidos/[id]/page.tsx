import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { OrderStatusHeader } from "@/components/views/pedidos/OrderStatusHeader"
import { OrderProgressBar } from "@/components/views/pedidos/OrderProgressBar"
import { OrderItemsList } from "@/components/views/pedidos/OrderItemsList"
import { OrderSummaryCard } from "@/components/views/pedidos/OrderSummaryCard"
import { OrderShippingCard } from "@/components/views/pedidos/OrderShippingCard"

type OrderItem = { id: string; quantity: number; price: number; products?: { id?: string | null; name?: string | null } | null }
type OrderAddress = Record<string, string | null | undefined>

export default async function DetalhesPedidoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect("/conta/login")

    const { data: order } = await supabase.from("orders").select(`*, order_items ( id, quantity, price, products ( id, name ) )`).eq("id", id).eq("user_id", user.id).single()
    if (!order) return <div className="page-shell py-20 text-center">Pedido não encontrado.</div>

    const terminalStatus = ["cancelled", "refunded", "disputed"].includes(order.status) ? order.status : null
    const orderItems = (order.order_items || []) as OrderItem[]
    const itemsSubtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const shippingAmount = typeof order.shipping_cost === "number" ? order.shipping_cost : Math.max(Number((order.total_amount - itemsSubtotal).toFixed(2)), 0)
    const addr = order.shipping_address as OrderAddress
    const addressStr = addr ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country].filter(Boolean).join(", ") : ""

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="mx-auto max-w-5xl space-y-8">
                <Button variant="ghost" className="-ml-4 w-fit" asChild>
                    <Link href="/conta/pedidos"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar aos pedidos</Link>
                </Button>

                <OrderStatusHeader orderId={order.id} createdAt={order.created_at} terminalStatus={terminalStatus} />

                {!terminalStatus && <OrderProgressBar status={order.status} />}

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <OrderItemsList items={orderItems} />
                    <div className="space-y-6">
                        <OrderSummaryCard itemsSubtotal={itemsSubtotal} shippingAmount={shippingAmount} totalAmount={order.total_amount} />
                        {addressStr && <OrderShippingCard companyName={order.shipping_company_name} serviceName={order.shipping_service_name} addressStr={addressStr} />}
                    </div>
                </div>
            </div>
        </div>
    )
}
