import { formatCurrency } from "@/lib/utils"

type OrderItem = {
    id: string
    quantity: number
    price: number
    products?: { id?: string | null; name?: string | null } | null
}

interface OrderItemsListProps {
    items: OrderItem[]
}

export function OrderItemsList({ items }: OrderItemsListProps) {
    return (
        <div className="surface-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl text-foreground">Itens do pedido</h2>
            <div className="mt-6 space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-[1.2rem] border border-border bg-card px-4 py-4">
                        <div>
                            <p className="font-medium text-foreground">{item.products?.name || "Produto removido"}</p>
                            <p className="mt-1 text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
