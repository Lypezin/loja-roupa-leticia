export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-zinc-500">
                    Visão geral da sua loja e métricas rápidas.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder para os cards de Vendas Totais, Pedidos, etc. */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Vendas no Mês</h3>
                    </div>
                    <div className="text-2xl font-bold">R$ 0,00</div>
                    <p className="text-xs text-muted-foreground">+0% em relação ao mês passado</p>
                </div>
            </div>
        </div>
    )
}
