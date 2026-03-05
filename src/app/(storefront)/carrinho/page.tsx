'use client'

import { useCartStore } from "@/store/useCartStore"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
    const [mounted, setMounted] = useState(false)

    // Prevenir Erro de Hydration entre Zustand (LocalStorage) e Next SSR HTML inicial
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse w-8 h-8 rounded-full bg-zinc-200"></div>
            </div>
        )
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

    return (
        <div className="container mx-auto px-4 py-10 md:py-16">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Sua Sacola</h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-zinc-500 mb-6 font-medium">Sua sacola de compras está vazia.</p>
                    <Link href="/">
                        <Button className="bg-zinc-950 text-white hover:bg-zinc-800 px-8 py-6 rounded-full cursor-pointer transition-all">
                            Continuar Comprando
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Lista de Itens (8 colunas) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 md:gap-6 py-6 border-b border-zinc-100 relative group">
                                <div className="w-24 md:w-32 aspect-[3/4] bg-zinc-100 rounded-lg overflow-hidden shrink-0 relative">
                                    {/* Fallback sem next/image pra protótipo pra n dar erro de remotePatterns do Nextjs agora */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${item.image_url || '/placeholder-image.jpg'})` }}
                                    />
                                </div>

                                <div className="flex flex-col flex-1 justify-between">
                                    <div className="flex flex-col md:flex-row md:justify-between pr-8 md:pr-0">
                                        <div>
                                            <h3 className="font-semibold text-lg text-zinc-900">{item.product_name}</h3>
                                            <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider">
                                                {item.color} - {item.size}
                                            </p>
                                        </div>
                                        <div className="mt-2 md:mt-0 font-medium text-lg text-zinc-900">
                                            {formatPrice(item.price)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-zinc-200 rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="p-2 text-zinc-500 hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
                                            >
                                                <Minus className="w-4 h-4 cursor-pointer" />
                                            </button>
                                            <span className="w-12 text-center text-sm font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 text-zinc-500 hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
                                            >
                                                <Plus className="w-4 h-4 cursor-pointer" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-600 p-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity absolute top-4 right-0 md:static cursor-pointer"
                                            title="Remover Item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumo e Checkout (4 colunas) */}
                    <div className="lg:col-span-4">
                        <div className="bg-zinc-50 rounded-2xl p-6 md:p-8 sticky top-24 border border-zinc-100">
                            <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between text-zinc-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-zinc-900">{formatPrice(totalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-zinc-600">
                                    <span>Frete</span>
                                    <span className="text-zinc-400">Calculado na próxima etapa</span>
                                </div>
                            </div>

                            <div className="border-t border-zinc-200 pt-4 mb-8">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatPrice(totalPrice())}</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">Em até 12x s/ juros no cartão.</p>
                            </div>

                            <Link href="/checkout" className="block w-full">
                                <Button className="w-full h-14 bg-zinc-950 hover:bg-zinc-800 text-white text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all">
                                    Finalizar Compra
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}
