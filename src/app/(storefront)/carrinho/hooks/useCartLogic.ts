'use client'

import { useEffect, useState, useSyncExternalStore } from "react"
import { createClient } from "@/lib/supabase/client"
import { readCustomerProfile } from "@/lib/customer-profile"
import { useCartStore } from "@/store/useCartStore"

export function useCartLogic() {
    const { items, selectedShipping, totalPrice } = useCartStore()
    const [defaultPostalCode, setDefaultPostalCode] = useState<string | null>(null)

    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    )

    useEffect(() => {
        const supabase = createClient()
        void supabase.auth.getUser().then(({ data }) => {
            const postalCode = readCustomerProfile(data.user)?.shippingAddress?.postal_code ?? null

            if (postalCode) {
                setDefaultPostalCode(postalCode)
            }
        })
    }, [])

    const subtotal = totalPrice()
    const shippingCost = selectedShipping?.cost ?? 0
    const total = Number((subtotal + shippingCost).toFixed(2))

    return {
        mounted,
        items,
        subtotal,
        shippingCost,
        total,
        selectedShipping,
        defaultPostalCode,
    }
}
