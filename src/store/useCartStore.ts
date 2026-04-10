import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CheckoutShippingSelection, ShippingQuoteOption } from '@/types/shipping'

export type CartItem = {
    id: string
    product_id: string
    product_name: string
    variation_id: string
    size: string
    color: string
    price: number
    quantity: number
    image_url?: string
}

function mapQuoteToSelection(quote: ShippingQuoteOption): CheckoutShippingSelection {
    return {
        provider: quote.provider,
        postal_code: quote.postal_code,
        service_id: quote.service_id,
        service_name: quote.service_name,
        company_name: quote.company_name,
        cost: quote.cost,
        provider_cost: quote.provider_cost,
        delivery_days: quote.delivery_days,
        processing_days: quote.processing_days,
        is_free_shipping: quote.is_free_shipping,
        quote_payload: quote.quote_payload,
    }
}

interface CartState {
    items: CartItem[]
    shippingPostalCode: string
    shippingQuotes: ShippingQuoteOption[]
    selectedShipping: CheckoutShippingSelection | null
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    setShippingPostalCode: (postalCode: string) => void
    setShippingQuotes: (quotes: ShippingQuoteOption[], postalCode: string) => void
    selectShipping: (quote: ShippingQuoteOption | null) => void
    clearShipping: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            shippingPostalCode: '',
            shippingQuotes: [],
            selectedShipping: null,
            addItem: (item) => set((state) => {
                const existingItem = state.items.find((candidate) => candidate.id === item.id)

                if (existingItem) {
                    return {
                        items: state.items.map((candidate) =>
                            candidate.id === item.id
                                ? { ...candidate, quantity: candidate.quantity + item.quantity }
                                : candidate
                        ),
                        shippingQuotes: [],
                        selectedShipping: null,
                    }
                }

                return {
                    items: [...state.items, item],
                    shippingQuotes: [],
                    selectedShipping: null,
                }
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((item) => item.id !== id),
                shippingQuotes: [],
                selectedShipping: null,
            })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
                shippingQuotes: [],
                selectedShipping: null,
            })),
            clearCart: () => set({
                items: [],
                shippingPostalCode: '',
                shippingQuotes: [],
                selectedShipping: null,
            }),
            setShippingPostalCode: (shippingPostalCode) => set({ shippingPostalCode }),
            setShippingQuotes: (shippingQuotes, shippingPostalCode) => set((state) => {
                const selectedStillValid = state.selectedShipping
                    ? shippingQuotes.find((quote) => quote.service_id === state.selectedShipping?.service_id)
                    : null

                return {
                    shippingQuotes,
                    shippingPostalCode,
                    selectedShipping: selectedStillValid ? mapQuoteToSelection(selectedStillValid) : null,
                }
            }),
            selectShipping: (quote) => set({
                selectedShipping: quote ? mapQuoteToSelection(quote) : null,
            }),
            clearShipping: () => set({
                shippingQuotes: [],
                selectedShipping: null,
            }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'ecommerce-cart-storage',
        }
    )
)
