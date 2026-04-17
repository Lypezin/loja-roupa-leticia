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
                description="Acompanhe pagamentos confirmados, emissão de etiquetas e exceções operacionais em um único fluxo. Status manual só entra quando o processo automático não cobre o caso."
            />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/92 px-5 py-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Pedidos ativos</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{activeOrders}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">Pagos, em preparação ou em transporte.</p>
                </div>
                <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/92 px-5 py-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Fluxo automático</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{automaticFlowOrders}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">Pedidos seguindo o processo normal da loja.</p>
                </div>
                <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/92 px-5 py-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Pendentes de etiqueta</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{awaitingShipment}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">Pedidos do Melhor Envio aguardando emissão.</p>
                </div>
                <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/92 px-5 py-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Exceções</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{exceptionOrders}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">Disputas, cancelamentos e reembolsos para revisão.</p>
                </div>
            </section>

            <section className="overflow-hidden rounded-[1.8rem] border border-zinc-200/80 bg-white/92 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
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
