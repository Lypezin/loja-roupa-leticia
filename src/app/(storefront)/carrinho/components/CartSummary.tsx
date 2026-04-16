'use client'

import Link from "next/link"
import { ArrowRight, Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { createCheckoutSession } from "@/app/(storefront)/_actions/checkout/create-session"
import { ShippingSelector } from "@/app/(storefront)/carrinho/components/ShippingSelector"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { CartTotals } from "./CartTotals"

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
                return
            }

            const targetUrl = result.redirectTo || result.url

            if (targetUrl) {
                window.location.assign(targetUrl)
                return
            }

            toast.error("Não foi possível iniciar o pagamento agora. Tente novamente em alguns segundos.")
        } catch {
            toast.error("Falha interna ao redirecionar para o pagamento.")
        } finally {
            setIsLoadingCheckout(false)
        }
    }

    return (
        <div className="lg:col-span-1">
            <div className="surface-card rounded-[1.7rem] p-4 sm:p-5 lg:sticky lg:top-24 lg:rounded-[1.9rem] lg:p-6">
                <h2 className="font-display text-[2rem] leading-none text-card-foreground md:text-3xl">Resumo</h2>

                <CartTotals
                    subtotal={formattedSubtotal}
                    shipping={formattedShipping}
                    total={formattedTotal}
                    installment={installment}
                    isFreeShipping={!!selectedShipping?.is_free_shipping}
                />

                <ShippingSelector defaultPostalCode={defaultPostalCode} />

                <div className="mt-6 space-y-3">
                    <Button
                        onClick={handleHostedCheckout}
                        disabled={checkoutDisabled}
                        className="h-12 w-full rounded-full text-[0.82rem] font-semibold uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.16em]"
                    >
                        {isLoadingCheckout ? (
                            <span className="flex items-center gap-2">Processando <Loader2 className="h-4 w-4 animate-spin" /></span>
                        ) : (
                            <span className="flex items-center gap-2">Pagar com AbacatePay <ArrowRight className="h-4 w-4" /></span>
                        )}
                    </Button>

                    {!selectedShipping && (
                        <p className="text-center text-xs text-muted-foreground">
                            Selecione o frete antes de seguir para o checkout.
                        </p>
                    )}

                    <Button
                        onClick={handleWhatsAppCheckout}
                        disabled={isLoadingCheckout}
                        variant="outline"
                        className="h-12 w-full rounded-full border-emerald-500/30 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-emerald-700 hover:bg-emerald-50 sm:text-sm sm:tracking-[0.16em]"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Finalizar via WhatsApp
                    </Button>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Checkout hospedado pela AbacatePay.
                </p>

                <Link href="/" className="mt-5 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Continuar comprando
                </Link>
            </div>
        </div>
    )
}
