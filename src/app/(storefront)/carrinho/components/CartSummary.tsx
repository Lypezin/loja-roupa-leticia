'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare } from "lucide-react"
import Link from "next/link"

interface CartSummaryProps {
    total: number;
    formattedTotal: string;
    installment: string;
    handleWhatsAppCheckout: () => void;
}

export function CartSummary({ total, formattedTotal, installment, handleWhatsAppCheckout }: CartSummaryProps) {
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
                    onClick={() => alert('O sistema de pagamento será implementado em breve! Obrigado pelo interesse.')}
                    className="w-full h-13 bg-foreground hover:bg-foreground/90 text-background text-sm font-semibold tracking-wide cursor-pointer flex items-center justify-center gap-2 rounded-xl"
                >
                    Finalizar Compra
                    <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                    onClick={handleWhatsAppCheckout}
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
