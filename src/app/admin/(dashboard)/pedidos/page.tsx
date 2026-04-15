import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { reconcilePendingAbacatePayAttempts } from "@/lib/abacatepay/reconcile"
import { getAdminOrders } from "./actions"
import OrderListClient from "./components/OrderListClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPedidos() {
    await reconcilePendingAbacatePayAttempts({ limit: 20 })
    const orders = await getAdminOrders()

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader title="Pedidos" />

            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                {orders.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <p className="text-sm leading-6 text-zinc-600">Nenhum pedido recebido ainda.</p>
                    </div>
                ) : (
                    <OrderListClient orders={orders} />
                )}
            </section>
        </div>
    )
}
