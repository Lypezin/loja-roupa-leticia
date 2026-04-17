'use client'

import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"
import { CartItem } from "./components/CartItem"
import { CartSummary } from "./components/CartSummary"
import { CartEmptyState } from "./components/CartEmptyState"
import { useCartLogic } from "./hooks/useCartLogic"

export default function CarrinhoPage() {
    const {
        mounted,
        items,
        subtotal,
        shippingCost,
        total,
        selectedShipping,
        defaultPostalCode,
    } = useCartLogic()

    const { removeItem, updateQuantity } = useCartStore()

    if (!mounted) {
        return (
            <div className="page-shell py-20">
                <div className="flex h-96 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return <CartEmptyState />
    }

    const formattedSubtotal = formatCurrency(subtotal)
    const formattedShipping = !selectedShipping ? "Calcular" : selectedShipping.is_free_shipping ? "Grátis" : formatCurrency(shippingCost)
    const formattedTotal = formatCurrency(total)
    const installment = formatCurrency(total / 3)

    return (
        <div className="page-shell py-6 md:py-14">
            <div className="paper-panel rounded-[1.7rem] px-4 py-5 sm:px-6 md:rounded-[2rem] md:px-8 md:py-6">
                <span className="eyebrow">sacola</span>
                <h1 className="mt-3 font-display text-[2.35rem] leading-tight text-foreground md:mt-4 md:text-5xl">Seu carrinho</h1>
                <p className="mt-3 text-sm text-muted-foreground">{items.length} {items.length === 1 ? "item" : "itens"} selecionado(s)</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-3 lg:gap-8">
                <div className="space-y-4 lg:col-span-2">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            removeItem={removeItem}
                            updateQuantity={updateQuantity}
                        />
                    ))}
                </div>

                <CartSummary
                    formattedSubtotal={formattedSubtotal}
                    formattedShipping={formattedShipping}
                    formattedTotal={formattedTotal}
                    installment={installment}
                    defaultPostalCode={defaultPostalCode}
                />
            </div>
        </div>
    )
}
