'use client'

import { Loader2, MapPin, Truck } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useShippingQuote } from "@/hooks/useShippingQuote"
import { useCartStore } from "@/store/useCartStore"
import { ShippingQuoteItem } from "@/components/views/cart/ShippingQuoteItem"
import { formatPostalCodeInput } from "@/components/views/cart/CartUtils"

type ShippingSelectorProps = {
    defaultPostalCode?: string | null
}

export function ShippingSelector({ defaultPostalCode }: ShippingSelectorProps) {
    const hasAppliedDefaultPostalCode = useRef(false)
    const {
        items,
        shippingPostalCode,
        shippingQuotes,
        selectedShipping,
        setShippingPostalCode,
        selectShipping,
        clearShipping,
    } = useCartStore()

    const { isPending, inlineError, setInlineError, handleQuote } = useShippingQuote()

    const hasQuotes = shippingQuotes.length > 0
    const selectionId = selectedShipping?.service_id ?? ""

    const quoteHint = useMemo(() => {
        if (!selectedShipping) return null
        return `${selectedShipping.company_name} - ${selectedShipping.service_name}`
    }, [selectedShipping])

    useEffect(() => {
        if (!defaultPostalCode) {
            return
        }

        if (!shippingPostalCode && !hasAppliedDefaultPostalCode.current) {
            setShippingPostalCode(defaultPostalCode)
            hasAppliedDefaultPostalCode.current = true
        }
    }, [defaultPostalCode, setShippingPostalCode, shippingPostalCode])

    const handlePostalCodeChange = (value: string) => {
        const formatted = formatPostalCodeInput(value)
        if (formatted !== shippingPostalCode && (selectedShipping || hasQuotes)) {
            clearShipping()
        }
        setShippingPostalCode(formatted)
        setInlineError(null)
    }

    return (
        <div className="mt-6 rounded-[1.5rem] border border-border bg-card/60 p-4">
            <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                    <Truck className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">Entrega</p>
                        {quoteHint && (
                            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {quoteHint}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                        Se o CEP mudar, recalcule o frete antes de pagar.
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                    <span className="sr-only">CEP de entrega</span>
                    <div className="relative">
                        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            inputMode="numeric"
                            value={shippingPostalCode}
                            onChange={(event) => handlePostalCodeChange(event.target.value)}
                            placeholder="Digite o CEP"
                            className="h-11 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                    </div>
                </label>

                <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-full px-5"
                    onClick={handleQuote}
                    disabled={isPending || items.length === 0}
                >
                    {isPending ? (
                        <>
                            Calculando <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                    ) : (
                        "Calcular frete"
                    )}
                </Button>
            </div>

            {inlineError && (
                <div className="mt-3 rounded-[1rem] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {inlineError}
                </div>
            )}

            {hasQuotes && (
                <div className="mt-4 space-y-2">
                    {shippingQuotes.map((quote) => (
                        <ShippingQuoteItem
                            key={quote.service_id}
                            quote={quote}
                            checked={selectionId === quote.service_id}
                            onSelect={selectShipping}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
