'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'
import { CheckCircle, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SucessoPage() {
    const { clearCart, items } = useCartStore()
    const [cleared, setCleared] = useState(false)

    useEffect(() => {
        // Limpa o carrinho local ao chegar na tela de sucesso
        if (items.length > 0 && !cleared) {
            clearCart()
            setCleared(true)
        }
    }, [clearCart, items, cleared])

    return (
        <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border text-center space-y-6 shadow-sm">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Pedido Confirmado!
                </h1>
                
                <p className="text-muted-foreground">
                    Que ótima escolha! Seu pagamento foi processado com sucesso. Você receberá as atualizações do seu pedido no e-mail fornecido.
                </p>

                <div className="pt-6">
                    <Link href="/">
                        <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-medium gap-2">
                            <ShoppingBag className="w-5 h-5" /> Voltar para a Loja
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
