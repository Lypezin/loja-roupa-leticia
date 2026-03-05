'use client'

import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface CartItemData {
    id: string
    product_name: string
    size: string
    color: string
    price: number
    quantity: number
    image_url: string
}

interface CartItemProps {
    item: CartItemData
    index: number
    onIncrement: (id: string) => void
    onDecrement: (id: string) => void
    onRemove: (id: string) => void
}

export function CartItem({ item, index, onIncrement, onDecrement, onRemove }: CartItemProps) {
    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)
    const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)

    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Imagem */}
            <Link href={`/produto/${item.id}`} className="w-24 h-28 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
                <div
                    className="w-full h-full bg-cover bg-center hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${item.image_url})` }}
                />
            </Link>

            {/* Dados */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-zinc-900">{item.product_name}</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">{item.size} · {item.color}</p>
                    <p className="text-sm text-zinc-500 mt-1">{formattedPrice}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-zinc-100 rounded-xl p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg cursor-pointer"
                            onClick={() => onDecrement(item.id)}
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg cursor-pointer"
                            onClick={() => onIncrement(item.id)}
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-zinc-900">{formattedTotal}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-red-500 cursor-pointer"
                            onClick={() => onRemove(item.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
