import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { reconcilePendingAbacatePayAttempts } from "@/lib/abacatepay/reconcile"
import { getAdminOrders } from "./actions"
import OrderListClient from "./components/OrderListClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPedidos() {
    try {
        await reconcilePendingAbacatePayAttempts({ limit: 20 })
    } catch (error) {
        console.error("Falha ao reconciliar pagamentos pendentes no admin:", error)
    }
    const orders = await getAdminOrders()
    const activeOrders = orders.filter((order) => ["paid", "processing", "shipped"].includes(order.status)).length
    const automaticFlowOrders = orders.filter((order) => !["disputed", "cancelled", "refunded"].includes(order.status)).length
    const exceptionOrders = orders.length - automaticFlowOrders
    const awaitingShipment = orders.filter((order) =>
        order.shipping_provider === "melhor_envio"
        && ["paid", "processing", "shipped"].includes(order.status)
        && !order.shipping_external_id,
    ).length

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                eyebrow="Operação"
                title="Pedidos e expedição"
                description="Acompanhe os pedidos pagos, emita etiquetas quando necessário e só ajuste status manualmente em casos excepcionais."
            />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Pedidos ativos</p>
                    <p className="mt-2 text-3xl font-semibold text-zinc-950">{activeOrders}</p>
                    <p className="mt-1 text-sm text-zinc-600">Pagos, em preparação ou em transporte.</p>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Fluxo automático</p>
                    <p className="mt-2 text-3xl font-semibold text-zinc-950">{automaticFlowOrders}</p>
                    <p className="mt-1 text-sm text-zinc-600">Pedidos seguindo o processo normal da loja.</p>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Pendentes de etiqueta</p>
                    <p className="mt-2 text-3xl font-semibold text-zinc-950">{awaitingShipment}</p>
                    <p className="mt-1 text-sm text-zinc-600">Pedidos do Melhor Envio aguardando emissão.</p>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Exceções</p>
                    <p className="mt-2 text-3xl font-semibold text-zinc-950">{exceptionOrders}</p>
                    <p className="mt-1 text-sm text-zinc-600">Disputas, cancelamentos e reembolsos para revisão.</p>
                </div>
            </section>

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
