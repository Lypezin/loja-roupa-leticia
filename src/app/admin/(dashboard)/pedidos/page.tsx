import { getAdminOrders } from './actions'
import OrderListClient from './components/OrderListClient'

export default async function AdminPedidos() {
    const orders = await getAdminOrders()

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                    <p className="text-muted-foreground">
                        Acompanhe as vendas e status de entrega.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                {orders.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        Nenhum pedido recebido ainda.
                    </div>
                ) : (
                    <OrderListClient orders={orders} />
                )}
            </div>
        </div>
    )
}
