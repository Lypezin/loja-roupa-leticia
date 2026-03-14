'use client'

import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function CarrinhoPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
    const [mounted, setMounted] = useState(false)
    const total = totalPrice()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { setMounted(true) }, [])

    const handleWhatsAppCheckout = async () => {
        const supabase = createClient()
        const { data: settings } = await supabase.from('store_settings').select('whatsapp_number, store_name').single()
        
        const phone = settings?.whatsapp_number || "5500000000000" // Fallback number
        const cleanPhone = phone.replace(/\D/g, '')
        
        let message = `*Novo Pedido - ${settings?.store_name || 'Loja'}*\n\n`
        message += `Olá! Gostaria de finalizar a compra dos seguintes itens:\n\n`
        
        items.forEach((item, index: number) => {
            message += `${index + 1}. *${item.product_name}*\n`
            message += `   Qtd: ${item.quantity}\n`
            if (item.color) message += `   Cor: ${item.color}\n`
            if (item.size) message += `   Tam: ${item.size}\n`
            message += `   Preço: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}\n\n`
        })
        
        message += `*Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}*`
        
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
        
        window.open(whatsappUrl, '_blank')
    }

    if (!mounted) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="h-96 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Seu carrinho está vazio</h1>
                    <p className="text-muted-foreground">Explore nossos produtos e encontre peças que combinam com você.</p>
                    <Link href="/">
                        <Button className="bg-foreground text-background hover:bg-foreground/90 cursor-pointer gap-2 mt-4">
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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Meu Carrinho</h1>
                <p className="text-muted-foreground text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
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
                                    className="flex flex-col sm:flex-row gap-5 p-4 bg-card border border-border rounded-2xl hover:border-primary/20 transition-colors"
                                >
                                    <div className="flex gap-4 sm:gap-5">
                                        {/* Imagem */}
                                        <div className="w-20 h-24 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-muted">
                                            <div
                                                className="w-full h-full bg-cover bg-center"
                                                style={{ backgroundImage: `url(${item.image_url || '/placeholder-image.jpg'})` }}
                                            />
                                        </div>

                                        {/* Info - Basic mobile view */}
                                        <div className="flex flex-col flex-1 justify-center sm:justify-start">
                                            <h3 className="font-semibold text-card-foreground leading-tight text-sm sm:text-base">{item.product_name}</h3>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                                {item.color && `Cor: ${item.color}`}{item.color && item.size && ' · '}{item.size && `Tam: ${item.size}`}
                                            </p>
                                            
                                            {/* Mobile price - visible on sm and below */}
                                            <div className="sm:hidden mt-2 font-bold text-sm text-card-foreground">
                                                {itemPrice}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls & Total - Full row on mobile sm, side by side on desktop */}
                                    <div className="flex items-center justify-between sm:flex-col sm:justify-between sm:items-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                                        {/* Quantity Controls */}
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
                        })}
                    </AnimatePresence>
                </div>

                {/* Resumo */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-card rounded-2xl p-6 space-y-5 border border-border">
                        <h2 className="font-semibold text-lg text-card-foreground">Resumo do pedido</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formattedTotal}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Frete</span>
                                <span className="text-emerald-600 font-medium">Grátis</span>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg text-card-foreground">
                                <span>Total</span>
                                <span>{formattedTotal}</span>
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                                ou 3x de {installment} sem juros
                            </p>
                        </div>

                        <Button
                            onClick={() => alert('O sistema de pagamento será implementado em breve! Obrigado pelo interesse.')}
                            className="w-full h-13 bg-foreground hover:bg-foreground/90 text-background text-sm font-semibold tracking-wide cursor-pointer flex items-center justify-center gap-2 rounded-xl"
                        >
                            Finalizar Compra
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        <Button
                            onClick={handleWhatsAppCheckout}
                            variant="outline"
                            className="w-full h-13 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wide cursor-pointer flex items-center justify-center gap-2 rounded-xl transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Finalizar via WhatsApp
                        </Button>

                        <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                            ← Continuar comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
