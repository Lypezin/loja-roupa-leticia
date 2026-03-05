import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
    id: string // ID temporário que pode ser a combinação de product_id + size + color
    product_id: string
    product_name: string
    variation_id: string
    size: string
    color: string
    price: number
    quantity: number
    image_url?: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => set((state) => {
                const existingItem = state.items.find((i) => i.id === item.id)
                if (existingItem) {
                    // Se já tem, só aumenta a quantidade
                    return {
                        items: state.items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    }
                }
                // Senão, adiciona no array
                return { items: [...state.items, item] }
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
            })),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'ecommerce-cart-storage', // nome no localStorage
        }
    )
)
