'use client'

import Link from "next/link"
import { ShoppingBag, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Header() {
    const totalItems = useCartStore((state) => state.totalItems())
    const [mounted, setMounted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Verificar se o usuário está logado
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user)
        })
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="lg:hidden text-zinc-600">
                        <Menu className="w-5 h-5" />
                    </Button>
                    <Link href="/" className="font-bold text-xl tracking-tighter">
                        LOJA MODA
                    </Link>
                </div>

                <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-zinc-600">
                    <Link href="/camisetas" className="hover:text-zinc-950 transition-colors">
                        Camisetas
                    </Link>
                    <Link href="/calcas" className="hover:text-zinc-950 transition-colors">
                        Calças
                    </Link>
                    <Link href="/acessorios" className="hover:text-zinc-950 transition-colors">
                        Acessórios
                    </Link>
                </nav>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-950">
                        <Search className="w-5 h-5" />
                    </Button>

                    {mounted && (
                        <Link href={isLoggedIn ? "/conta" : "/conta/login"}>
                            <Button variant="ghost" size="icon" className={`relative text-zinc-600 hover:text-zinc-950 ${isLoggedIn ? 'text-zinc-950' : ''}`}>
                                <User className="w-5 h-5" />
                                {isLoggedIn && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 ring-2 ring-white" />
                                )}
                            </Button>
                        </Link>
                    )}

                    <Link href="/carrinho" passHref>
                        <Button variant="ghost" size="icon" className="relative text-zinc-600 hover:text-zinc-950">
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>

            </div>
        </header>
    )
}
