const statusBadge: Record<string, string> = {
    cancelled: "Cancelado",
    refunded: "Reembolsado",
    disputed: "Em disputa",
}

const statusBadgeColor: Record<string, string> = {
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-stone-200 text-stone-700",
    disputed: "bg-amber-100 text-amber-700",
}

interface OrderStatusHeaderProps {
    orderId: string
    createdAt: string
    terminalStatus: string | null
}

export function OrderStatusHeader({ orderId, createdAt, terminalStatus }: OrderStatusHeaderProps) {
    return (
        <div className="paper-panel rounded-[2rem] px-6 py-8 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="eyebrow">pedido</span>
                    <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
                        #{orderId.split("-")[0].toUpperCase()}
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Realizado em {new Date(createdAt).toLocaleString("pt-BR")}
                    </p>
                </div>
                {terminalStatus && (
                    <span className={`rounded-full px-4 py-2 text-xs font-medium ${statusBadgeColor[terminalStatus] || "bg-muted text-foreground"}`}>
                        {statusBadge[terminalStatus] || terminalStatus}
                    </span>
                )}
            </div>
        </div>
    )
}
