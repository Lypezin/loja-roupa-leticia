import { useState, useTransition } from "react"
import { toast } from "sonner"
import { quoteShippingOptions } from "@/app/(storefront)/_actions/shipping-actions"
import { useCartStore } from "@/store/useCartStore"

export function useShippingQuote() {
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)
    const {
        items,
        shippingPostalCode,
        selectedShipping,
        setShippingQuotes,
        selectShipping,
        clearShipping,
    } = useCartStore()

    const handleQuote = () => {
        if (items.length === 0) return

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
                const message = "Nenhuma opção de frete foi encontrada para este CEP."
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

    return {
        isPending,
        inlineError,
        setInlineError,
        handleQuote,
    }
}
