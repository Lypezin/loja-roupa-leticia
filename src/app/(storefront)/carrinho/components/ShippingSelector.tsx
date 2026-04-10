'use client'

import { Loader2, MapPin, Truck } from "lucide-react"
import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { quoteShippingOptions } from "@/app/(storefront)/actions"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"
import type { ShippingQuoteOption } from "@/types/shipping"

type ShippingSelectorProps = {
    defaultPostalCode?: string | null
}

function formatPostalCodeInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8)

    if (digits.length <= 5) {
        return digits
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function getDeliveryLabel(quote: ShippingQuoteOption) {
    const totalDays = quote.delivery_days

    if (totalDays <= 0) {
        return "Prazo sob consulta"
    }

    if (totalDays === 1) {
        return "1 dia util"
    }

    return `${totalDays} dias uteis`
}

export function ShippingSelector({ defaultPostalCode }: ShippingSelectorProps) {
    const {
        items,
        shippingPostalCode,
        shippingQuotes,
        selectedShipping,
        setShippingPostalCode,
        setShippingQuotes,
        selectShipping,
        clearShipping,
    } = useCartStore()
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)
    const hasQuotes = shippingQuotes.length > 0
    const selectionId = selectedShipping?.service_id ?? ""
    const quoteHint = useMemo(() => {
        if (!selectedShipping) {
            return null
        }

        return `${selectedShipping.company_name} - ${selectedShipping.service_name}`
    }, [selectedShipping])

    useEffect(() => {
        if (defaultPostalCode && !shippingPostalCode) {
            setShippingPostalCode(defaultPostalCode)
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

    const handleQuote = () => {
        if (items.length === 0) {
            return
        }

        startTransition(async () => {
            const result = await quoteShippingOptions(items, shippingPostalCode)

            if (result.error) {
                setInlineError(result.error)
                toast.error(result.error)
                clearShipping()
                return
            }

            const options = result.options || []

            if (options.length === 0) {
                const message = "Nenhuma opcao de frete foi encontrada para este CEP."
                setInlineError(message)
                toast.error(message)
                clearShipping()
                return
            }

            setInlineError(null)
            setShippingQuotes(options, shippingPostalCode)
            const nextSelection = selectedShipping
                ? options.find((quote) => quote.service_id === selectedShipping.service_id) ?? options[0] ?? null
                : options[0] ?? null
            selectShipping(nextSelection)
            toast.success("Frete calculado com sucesso.")
        })
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
                        Calcule o frete com o mesmo CEP salvo no seu cadastro para evitar divergencia no checkout.
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
                    {shippingQuotes.map((quote) => {
                        const checked = selectionId === quote.service_id

                        return (
                            <label
                                key={quote.service_id}
                                className={`flex cursor-pointer items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-3 transition-colors ${
                                    checked
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-background hover:border-primary/40"
                                }`}
                            >
                                <div className="flex min-w-0 items-start gap-3">
                                    <input
                                        type="radio"
                                        name="shipping-option"
                                        className="mt-1 h-4 w-4 accent-primary"
                                        checked={checked}
                                        onChange={() => selectShipping(quote)}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground">
                                            {quote.company_name} - {quote.service_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {getDeliveryLabel(quote)}
                                            {quote.processing_days > 0 ? ` ja com ${quote.processing_days} dia(s) de preparo` : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={`text-sm font-semibold ${quote.is_free_shipping ? "text-emerald-600" : "text-foreground"}`}>
                                        {quote.is_free_shipping ? "Gratis" : formatCurrency(quote.cost)}
                                    </p>
                                    {quote.is_free_shipping && quote.provider_cost > 0 && (
                                        <p className="text-[11px] text-muted-foreground line-through">
                                            {formatCurrency(quote.provider_cost)}
                                        </p>
                                    )}
                                </div>
                            </label>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
