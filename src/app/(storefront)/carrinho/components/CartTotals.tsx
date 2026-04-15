'use client'

interface CartTotalsProps {
    subtotal: string
    shipping: string
    total: string
    installment: string
    isFreeShipping: boolean
}

export function CartTotals({
    subtotal,
    shipping,
    total,
    installment,
    isFreeShipping
}: CartTotalsProps) {
    return (
        <div className="mt-5 space-y-3 text-sm md:mt-6">
            <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{subtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span className={isFreeShipping ? "font-medium text-emerald-600" : ""}>
                    {shipping}
                </span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-[1.05rem] font-semibold text-card-foreground md:text-lg">
                <span>Total</span>
                <span>{total}</span>
            </div>
            <p className="text-right text-xs text-muted-foreground">
                ou 3x de {installment} sem juros
            </p>
        </div>
    )
}
