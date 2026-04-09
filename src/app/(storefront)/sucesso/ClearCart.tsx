'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'

type ClearCartOnSuccessProps = {
    enabled: boolean
}

export function ClearCartOnSuccess({ enabled }: ClearCartOnSuccessProps) {
    const { clearCart, items } = useCartStore()

    useEffect(() => {
        if (enabled && items.length > 0) {
            clearCart()
        }
    }, [clearCart, enabled, items])

    return null
}
