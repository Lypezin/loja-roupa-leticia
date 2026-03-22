'use client'

import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { CartItem } from "./components/CartItem"
import { CartSummary } from "./components/CartSummary"
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
        
        const phone = settings?.whatsapp_number || "5500000000000"
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
            <div className="container mx-auto px-4 py-20 bg-background min-h-[60vh]">
                <div className="h-96 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 min-h-[60vh]">
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
        <div className="container mx-auto px-4 py-8 md:py-14 min-h-[80vh]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Meu Carrinho</h1>
                <p className="text-muted-foreground text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {items.map((item) => (
                            <CartItem 
                                key={item.id} 
                                item={item} 
                                removeItem={removeItem} 
                                updateQuantity={updateQuantity} 
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <CartSummary 
                    total={total}
                    formattedTotal={formattedTotal}
                    installment={installment}
                    handleWhatsAppCheckout={handleWhatsAppCheckout}
                />
            </div>
        </div>
    )
}
