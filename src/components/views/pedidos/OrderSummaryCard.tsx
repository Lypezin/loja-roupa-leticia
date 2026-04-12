import { formatCurrency } from "@/lib/utils"

interface OrderSummaryCardProps {
    itemsSubtotal: number
    shippingAmount: number
    totalAmount: number
}

export function OrderSummaryCard({ itemsSubtotal, shippingAmount, totalAmount }: OrderSummaryCardProps) {
    return (
        <div className="surface-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl text-foreground">Resumo</h2>
            <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Frete</span>
                    <span>{shippingAmount > 0 ? formatCurrency(shippingAmount) : "Grátis"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                </div>
            </div>
        </div>
    )
}
