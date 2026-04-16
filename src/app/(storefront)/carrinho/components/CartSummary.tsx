'use client'

import Link from "next/link"
import { ArrowRight, Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { createCheckoutSession, createWhatsAppCheckoutSession } from "@/app/(storefront)/_actions/checkout/create-session"
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
}

export function CartSummary({
    formattedSubtotal,
    formattedShipping,
    formattedTotal,
    installment,
    defaultPostalCode,
}: CartSummaryProps) {
    const { items, selectedShipping } = useCartStore()
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)
    const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false)
    const isBusy = isLoadingCheckout || isLoadingWhatsApp
    const checkoutDisabled = items.length === 0 || !selectedShipping || isBusy

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

    const handleWhatsAppCheckout = async () => {
        if (items.length === 0 || !selectedShipping) {
            toast.error("Calcule e selecione um frete antes de seguir pelo WhatsApp.")
            return
        }

        setIsLoadingWhatsApp(true)
        const popupWindow = window.open("", "_blank", "noopener,noreferrer")

        try {
            const result = await createWhatsAppCheckoutSession(items, selectedShipping)

            if (result.error) {
                popupWindow?.close()
                toast.error(result.error)
                return
            }

            if (result.redirectTo) {
                popupWindow?.close()
                window.location.assign(result.redirectTo)
                return
            }

            if (result.whatsappUrl) {
                if (popupWindow) {
                    popupWindow.location.href = result.whatsappUrl
                } else {
                    window.location.assign(result.whatsappUrl)
                }

                return
            }

            popupWindow?.close()
            toast.error("Nao foi possivel abrir o atendimento no WhatsApp agora.")
        } catch {
            popupWindow?.close()
            toast.error("Falha interna ao preparar o atendimento via WhatsApp.")
        } finally {
            setIsLoadingWhatsApp(false)
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
                        disabled={checkoutDisabled}
                        variant="outline"
                        className="h-12 w-full rounded-full border-emerald-500/30 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-emerald-700 hover:bg-emerald-50 sm:text-sm sm:tracking-[0.16em]"
                    >
                        {isLoadingWhatsApp ? (
                            <span className="flex items-center gap-2">Preparando <Loader2 className="h-4 w-4 animate-spin" /></span>
                        ) : (
                            <span className="flex items-center gap-2">Receber link no WhatsApp <MessageSquare className="h-4 w-4" /></span>
                        )}
                    </Button>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Checkout hospedado pela AbacatePay.
                </p>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    Pedido, estoque e envio so sao confirmados apos o pagamento.
                </p>

                <Link href="/" className="mt-5 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Continuar comprando
                </Link>
            </div>
        </div>
    )
}
