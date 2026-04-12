'use client'

import Link from "next/link"
import { ArrowRight, Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { createCheckoutSession } from "@/app/(storefront)/actions"
import { ShippingSelector } from "@/app/(storefront)/carrinho/components/ShippingSelector"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"

interface CartSummaryProps {
    formattedSubtotal: string
    formattedShipping: string
    formattedTotal: string
    installment: string
    defaultPostalCode?: string | null
    handleWhatsAppCheckout: () => void
}

export function CartSummary({
    formattedSubtotal,
    formattedShipping,
    formattedTotal,
    installment,
    defaultPostalCode,
    handleWhatsAppCheckout,
}: CartSummaryProps) {
    const { items, selectedShipping } = useCartStore()
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)
    const checkoutDisabled = items.length === 0 || !selectedShipping || isLoadingCheckout

    const handleHostedCheckout = async () => {
        if (items.length === 0 || !selectedShipping) {
            toast.error("Calcule e selecione um frete antes de finalizar a compra.")
            return
        }

        setIsLoadingCheckout(true)

        try {
            const result = await createCheckoutSession(items, selectedShipping)

            if (result.error) {
                toast.error(result.error)
                setIsLoadingCheckout(false)
                return
            }

            if (result.redirectTo) {
                window.location.href = result.redirectTo
                return
            }

            if (result.url) {
                window.location.href = result.url
                return
            }

            toast.error("Não foi possível iniciar o pagamento.")
            setIsLoadingCheckout(false)
        } catch {
            toast.error("Falha interna ao redirecionar para o pagamento.")
            setIsLoadingCheckout(false)
        }
    }

    return (
        <div className="lg:col-span-1">
            <div className="surface-card sticky top-24 rounded-[1.9rem] p-6">
                <h2 className="font-display text-3xl text-card-foreground">Resumo</h2>

                <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formattedSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Frete</span>
                        <span className={selectedShipping?.is_free_shipping ? "font-medium text-emerald-600" : ""}>
                            {formattedShipping}
                        </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-card-foreground">
                        <span>Total</span>
                        <span>{formattedTotal}</span>
                    </div>
                    <p className="text-right text-xs text-muted-foreground">
                        ou 3x de {installment} sem juros
                    </p>
                </div>

                <ShippingSelector defaultPostalCode={defaultPostalCode} />

                <Button
                    onClick={handleHostedCheckout}
                    disabled={checkoutDisabled}
                    className="mt-6 h-12 w-full rounded-full text-sm font-semibold uppercase tracking-[0.16em]"
                >
                    {isLoadingCheckout ? (
                        <>
                            Processando <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                    ) : (
                        <>
                            Pagar com AbacatePay <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>

                {!selectedShipping && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                        Selecione o frete antes de seguir para o checkout.
                    </p>
                )}

                <p className="mt-3 text-center text-xs text-muted-foreground">
                    Checkout hospedado pela AbacatePay.
                </p>

                <Button
                    onClick={handleWhatsAppCheckout}
                    disabled={isLoadingCheckout}
                    variant="outline"
                    className="mt-3 h-12 w-full rounded-full border-emerald-500/30 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 hover:bg-emerald-50"
                >
                    <MessageSquare className="h-4 w-4" />
                    Finalizar via WhatsApp
                </Button>

                <Link href="/" className="mt-5 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Continuar comprando
                </Link>
            </div>
        </div>
    )
}
