'use client'

import Link from "next/link"
import { ShoppingBag, Menu, User, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { MobileMenu } from "./MobileMenu"

export interface Category {
    id: string
    name: string
    slug: string
}

export function Header({ categories = [] }: { categories?: Category[] }) {
    const totalItems = useCartStore((state) => state.totalItems())
    const [mounted, setMounted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setMounted(true)

        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsLoggedIn(!!user)
        })

        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const displayCategories = categories.slice(0, 4)
    const extraCategories = categories.slice(4)

    return (
        <>
            <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
                ? 'bg-white/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)] border-b border-zinc-200/50'
                : 'bg-transparent'
                }`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo + Mobile Menu Trigger */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="lg:hidden p-2 rounded-lg hover:bg-zinc-100/80 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-zinc-700" />
                        </button>
                        <Link href="/" className="font-bold text-xl tracking-[-0.05em] text-zinc-900 hover:opacity-70 transition-opacity">
                            FASHION STORE
                        </Link>
                    </div>

                    {/* Nav Desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {displayCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/${cat.slug}`}
                                className="relative px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100/60 group"
                            >
                                {cat.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-zinc-900 rounded-full transition-all duration-300 group-hover:w-1/2" />
                            </Link>
                        ))}

                        {/* Dropdown menu para mais categorias */}
                        {extraCategories.length > 0 && (
                            <div className="relative group/dropdown">
                                <button className="relative px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100/60 flex items-center gap-1">
                                    Mais
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-zinc-900 rounded-full transition-all duration-300 group-[&:hover]/dropdown:w-1/2" />
                                </button>

                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-xl opacity-0 invisible group-[&:hover]/dropdown:opacity-100 group-[&:hover]/dropdown:visible transition-all duration-300 transform origin-top-right group-[&:hover]/dropdown:translate-y-0 translate-y-2 z-50">
                                    <div className="py-2 flex flex-col">
                                        {extraCategories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/${cat.slug}`}
                                                className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="w-px h-4 bg-zinc-200 mx-2" />

                        <Link
                            href="/sobre"
                            className="relative px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100/60 group"
                        >
                            Sobre
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-zinc-900 rounded-full transition-all duration-300 group-hover:w-1/2" />
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {mounted && (
                            <Link href={isLoggedIn ? "/conta" : "/conta/login"}>
                                <button className="relative p-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60 transition-all">
                                    <User className="w-5 h-5" />
                                    {isLoggedIn && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"
                                        />
                                    )}
                                </button>
                            </Link>
                        )}

                        <Link href="/carrinho">
                            <button className="relative p-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60 transition-all">
                                <ShoppingBag className="w-5 h-5" />
                                {mounted && totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white shadow-lg"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </button>
                        </Link>
                    </div>

                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={mobileMenu}
                onClose={() => setMobileMenu(false)}
                categories={categories}
            />
        </>
    )
}
