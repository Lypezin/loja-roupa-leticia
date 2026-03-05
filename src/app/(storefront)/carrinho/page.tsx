'use client'

import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function CarrinhoPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
    const [mounted, setMounted] = useState(false)
    const total = totalPrice()

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="h-96 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Seu carrinho está vazio</h1>
                    <p className="text-zinc-500">Explore nossos produtos e encontre peças que combinam com você.</p>
                    <Link href="/">
                        <Button className="bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer gap-2 mt-4">
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para a Loja
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)
    const installment = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total / 3)

    return (
        <div className="container mx-auto px-4 py-8 md:py-14">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Meu Carrinho</h1>
                <p className="text-zinc-400 text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Itens */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {items.map((item) => {
                            const itemPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                                    className="flex gap-5 p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-colors"
                                >
                                    {/* Imagem */}
                                    <div className="w-24 h-28 md:w-28 md:h-32 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
                                        <div
                                            className="w-full h-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${item.image_url || '/placeholder-image.jpg'})` }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 leading-tight">{item.product_name}</h3>
                                            <p className="text-xs text-zinc-400 mt-1">
                                                {item.color && `Cor: ${item.color}`}{item.color && item.size && ' · '}{item.size && `Tam: ${item.size}`}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-0 border border-zinc-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            removeItem(item.id)
                                                        } else {
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5 text-zinc-500" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-zinc-500" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold text-zinc-900">{itemPrice}</span>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* Resumo */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-zinc-50 rounded-2xl p-6 space-y-5 border border-zinc-100">
                        <h2 className="font-semibold text-lg">Resumo do pedido</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-zinc-500">
                                <span>Subtotal</span>
                                <span>{formattedTotal}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500">
                                <span>Frete</span>
                                <span className="text-emerald-600 font-medium">Grátis</span>
                            </div>
                            <div className="border-t border-zinc-200 pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formattedTotal}</span>
                            </div>
                            <p className="text-xs text-zinc-400 text-right">
                                ou 3x de {installment} sem juros
                            </p>
                        </div>

                        <Button
                            onClick={() => alert('O sistema de pagamento será implementado em breve! Obrigado pelo interesse.')}
                            className="w-full h-13 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-semibold tracking-wide cursor-pointer flex items-center justify-center gap-2 rounded-xl"
                        >
                            Finalizar Compra
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        <Link href="/" className="block text-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                            ← Continuar comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
