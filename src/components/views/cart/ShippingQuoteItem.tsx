import { formatCurrency } from "@/lib/utils"
import type { ShippingQuoteOption } from "@/types/shipping"
import { getDeliveryLabel } from "./CartUtils"

interface ShippingQuoteItemProps {
    quote: ShippingQuoteOption
    checked: boolean
    onSelect: (quote: ShippingQuoteOption) => void
}

export function ShippingQuoteItem({ quote, checked, onSelect }: ShippingQuoteItemProps) {
    return (
        <label
            className={`interactive-panel flex cursor-pointer items-center justify-between gap-3 rounded-[1.2rem] border px-4 py-3 ${
                checked
                    ? "border-primary bg-primary/5 shadow-[0_12px_30px_rgba(90,63,43,0.08)]"
                    : "border-border bg-background hover:border-primary/40 hover:bg-accent/30"
            }`}
        >
            <div className="flex min-w-0 items-start gap-3">
                <input
                    type="radio"
                    name="shipping-option"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={checked}
                    onChange={() => onSelect(quote)}
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                        {quote.company_name} - {quote.service_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {getDeliveryLabel(quote)}
                        {quote.processing_days > 0 ? ` já com ${quote.processing_days} dia(s) de preparo` : ""}
                    </p>
                </div>
            </div>

            <div className="text-right">
                <p className={`text-sm font-semibold ${quote.is_free_shipping ? "text-emerald-600" : "text-foreground"}`}>
                    {quote.is_free_shipping ? "Grátis" : formatCurrency(quote.cost)}
                </p>
                {quote.is_free_shipping && quote.provider_cost > 0 && (
                    <p className="text-[11px] text-muted-foreground line-through">
                        {formatCurrency(quote.provider_cost)}
                    </p>
                )}
            </div>
        </label>
    )
}
