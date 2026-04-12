import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { getAdminOrders } from "./actions"
import OrderListClient from "./components/OrderListClient"

export default async function AdminPedidos() {
    const orders = await getAdminOrders()

    const paidOrders = orders.filter((order) => order.status === "paid").length
    const inTransitOrders = orders.filter((order) => ["processing", "shipped"].includes(order.status)).length
    const receiptOrders = orders.filter((order) => Boolean(order.payment_receipt_url)).length

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                eyebrow="Vendas"
                title="Pedidos com status mais legíveis."
                description="Acompanhe pagamento, itens, frete e andamento da entrega em uma visão única, com atualização rápida de status e leitura operacional mais direta."
                metrics={[
                    { label: "Pedidos totais", value: String(orders.length), description: "Histórico carregado no painel." },
                    { label: "Pagos", value: String(paidOrders), description: "Pedidos já confirmados." },
                    { label: "Em andamento", value: String(inTransitOrders), description: "Processando ou enviados." },
                    { label: "Com recibo", value: String(receiptOrders), description: "Pedidos com comprovante salvo." },
                ]}
            />

            <section className="overflow-hidden rounded-[1.8rem] border border-zinc-200/80 bg-white/90 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
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
