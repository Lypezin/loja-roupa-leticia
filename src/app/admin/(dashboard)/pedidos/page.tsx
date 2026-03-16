export default function AdminPedidos() {
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

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 text-center">
                <p className="text-muted-foreground">Nenhum pedido recebido ainda.</p>
            </div>
        </div>
    )
}
