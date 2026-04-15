'use client'

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"

type CartLineItem = {
    id: string
    product_name: string
    color?: string
    size?: string
    quantity: number
    price: number
    image_url?: string
}

interface CartItemProps {
    item: CartLineItem
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
}

export function CartItem({ item, removeItem, updateQuantity }: CartItemProps) {
    const itemPrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.price * item.quantity)

    return (
        <div className="surface-card interactive-panel flex flex-col gap-5 rounded-[1.8rem] p-4 sm:flex-row sm:items-center">
            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[1.2rem] bg-muted sm:h-32 sm:w-28">
                <Image
                    src={item.image_url || "/placeholder-image.jpg"}
                    alt={item.product_name}
                    fill
                    className="object-cover transition-transform duration-500"
                    sizes="112px"
                />
            </div>

            <div className="min-w-0 flex flex-1 flex-col justify-center">
                <h3 className="font-display text-2xl leading-tight text-foreground">{item.product_name}</h3>
                <p className="mt-2 break-words text-sm text-muted-foreground">
                    {[item.color && `Cor: ${item.color}`, item.size && `Tam: ${item.size}`].filter(Boolean).join(" · ")}
                </p>
            </div>

            <div className="flex flex-col gap-4 sm:items-end">
                <span className="text-base font-semibold text-foreground">{itemPrice}</span>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <div className="flex items-center overflow-hidden rounded-full border border-border bg-card">
                        <button
                            onClick={() => {
                                if (item.quantity <= 1) {
                                    removeItem(item.id)
                                } else {
                                    updateQuantity(item.id, item.quantity - 1)
                                }
                            }}
                            className="interactive-press px-3 py-2 text-foreground transition-colors hover:bg-accent"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="interactive-press px-3 py-2 text-foreground transition-colors hover:bg-accent"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <button
                        onClick={() => removeItem(item.id)}
                        className="interactive-icon interactive-press flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
