import { getAdminOrders } from './actions'
import OrderListClient from './components/OrderListClient'

export default async function AdminPedidos() {
    const orders = await getAdminOrders()

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pedidos</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Acompanhe vendas e gerencie status de entrega.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                {orders.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm text-muted-foreground">Nenhum pedido recebido ainda.</p>
                    </div>
                ) : (
                    <OrderListClient orders={orders} />
                )}
            </div>
        </div>
    )
}
