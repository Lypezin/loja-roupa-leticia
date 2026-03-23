'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { createCheckoutSession } from "@/app/(storefront)/actions"

interface CartSummaryProps {
    total: number;
    formattedTotal: string;
    installment: string;
    handleWhatsAppCheckout: () => void;
}

export function CartSummary({ total, formattedTotal, installment, handleWhatsAppCheckout }: CartSummaryProps) {
    const { items } = useCartStore()
    const [isLoadingStripe, setIsLoadingStripe] = useState(false)

    // Handler para disparar a Stripe
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
                window.location.href = result.url // Redireciona o cliente para a tela oficial de pagamento
            }
        } catch (error) {
            alert('Falha interna ao redirecionar para pagamentos.')
            setIsLoadingStripe(false)
        }
    }

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl p-6 space-y-5 border border-border">
                <h2 className="font-semibold text-lg text-card-foreground">Resumo do pedido</h2>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Frete</span>
                        <span className="text-emerald-600 font-medium">Grátis</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-lg text-card-foreground">
                        <span>Total</span>
                        <span>{formattedTotal}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                        ou 3x de {installment} sem juros
                    </p>
                </div>

                <Button
                    onClick={handleStripeCheckout}
                    disabled={isLoadingStripe}
                    className="w-full h-13 bg-foreground hover:bg-foreground/90 text-background text-sm font-semibold tracking-wide cursor-pointer flex items-center justify-center gap-2 rounded-xl disabled:opacity-70"
                >
                    {isLoadingStripe ? (
                        <>Processando <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                        <>Finalizar Compra <ArrowRight className="w-4 h-4" /></>
                    )}
                </Button>

                <Button
                    onClick={handleWhatsAppCheckout}
                    disabled={isLoadingStripe}
                    variant="outline"
                    className="w-full h-13 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wide cursor-pointer flex items-center justify-center gap-2 rounded-xl transition-colors"
                >
                    <MessageSquare className="w-4 h-4" />
                    Finalizar via WhatsApp
                </Button>

                <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    ← Continuar comprando
                </Link>
            </div>
        </div>
    )
}
