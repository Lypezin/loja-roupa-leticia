'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'

export function ClearCartOnSuccess() {
    const { clearCart, items } = useCartStore()

    useEffect(() => {
        if (items.length > 0) {
            clearCart()
        }
    }, [clearCart, items])

    return null
}
