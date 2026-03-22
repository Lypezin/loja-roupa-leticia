'use client'

import { motion } from "framer-motion"
import { Trash2, Plus, Minus } from "lucide-react"

interface CartItemProps {
    item: any;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
}

export function CartItem({ item, removeItem, updateQuantity }: CartItemProps) {
    const itemPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
            className="flex flex-col sm:flex-row gap-5 p-4 bg-card border border-border rounded-2xl hover:border-primary/20 transition-colors"
        >
            <div className="flex gap-4 sm:gap-5">
                <div className="w-20 h-24 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-muted">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image_url || '/placeholder-image.jpg'})` }}
                    />
                </div>

                <div className="flex flex-col flex-1 justify-center sm:justify-start">
                    <h3 className="font-semibold text-card-foreground leading-tight text-sm sm:text-base">{item.product_name}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        {item.color && `Cor: ${item.color}`}{item.color && item.size && ' · '}{item.size && `Tam: ${item.size}`}
                    </p>
                    
                    <div className="sm:hidden mt-2 font-bold text-sm text-card-foreground">
                        {itemPrice}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:justify-between sm:items-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden h-9 sm:h-10">
                    <button
                        onClick={() => {
                            if (item.quantity <= 1) {
                                removeItem(item.id)
                            } else {
                                updateQuantity(item.id, item.quantity - 1)
                            }
                        }}
                        className="px-3 py-1 hover:bg-muted transition-colors text-foreground"
                    >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium text-foreground">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-muted transition-colors text-foreground"
                    >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:block font-semibold text-card-foreground">{itemPrice}</span>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
