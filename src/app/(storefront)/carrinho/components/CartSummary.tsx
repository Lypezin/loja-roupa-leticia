'use client'

import Link from "next/link"
import { ArrowRight, Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { createCheckoutSession } from "@/app/(storefront)/actions"

interface CartSummaryProps {
    formattedTotal: string
    installment: string
    handleWhatsAppCheckout: () => void
}

export function CartSummary({ formattedTotal, installment, handleWhatsAppCheckout }: CartSummaryProps) {
    const { items } = useCartStore()
    const [isLoadingStripe, setIsLoadingStripe] = useState(false)

    const handleStripeCheckout = async () => {
        if (items.length === 0) return

        setIsLoadingStripe(true)
        try {
            const result = await createCheckoutSession(items)

            if (result.error) {
                alert(result.error)
                setIsLoadingStripe(false)
                return
            }

            if (result.url) {
                window.location.href = result.url
            }
        } catch {
            alert("Falha interna ao redirecionar para pagamentos.")
            setIsLoadingStripe(false)
        }
    }

    return (
        <div className="lg:col-span-1">
            <div className="surface-card sticky top-24 rounded-[1.9rem] p-6">
                <h2 className="font-display text-3xl text-card-foreground">Resumo</h2>

                <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Frete</span>
                        <span className="font-medium text-emerald-600">Gratis</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-card-foreground">
                        <span>Total</span>
                        <span>{formattedTotal}</span>
                    </div>
                    <p className="text-right text-xs text-muted-foreground">
                        ou 3x de {installment} sem juros
                    </p>
                </div>

                <Button
                    onClick={handleStripeCheckout}
                    disabled={isLoadingStripe}
                    className="mt-6 h-12 w-full rounded-full text-sm font-semibold uppercase tracking-[0.16em]"
                >
                    {isLoadingStripe ? (
                        <>
                            Processando <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                    ) : (
                        <>
                            Finalizar compra <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>

                <Button
                    onClick={handleWhatsAppCheckout}
                    disabled={isLoadingStripe}
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
