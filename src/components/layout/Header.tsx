'use client'

import Link from "next/link"
import { ShoppingBag, Menu, User, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { MobileMenu } from "./MobileMenu"
import { ThemeToggle } from "./ThemeToggle"
import { SearchBar } from "./SearchBar"

export interface Category {
    id: string
    name: string
    slug: string
}

export function Header({ categories = [], storeName }: { categories?: Category[]; storeName?: string }) {
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
                ? 'bg-background/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)] border-b border-border/50'
                : 'bg-transparent'
                }`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo + Mobile Menu Trigger */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <Menu className="w-5 h-5 text-foreground" />
                        </button>
                        <Link href="/" className="font-bold text-xl tracking-[-0.05em] text-foreground hover:opacity-70 transition-opacity">
                            {storeName || 'FASHION STORE'}
                        </Link>
                    </div>

                    {/* Search Bar - Desktop (Item 2) */}
                    <div className="hidden lg:block flex-1 max-w-md mx-8">
                        <SearchBar />
                    </div>

                    {/* Nav Desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {displayCategories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/${cat.slug}`}
                                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
                            >
                                {cat.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2" />
                            </Link>
                        ))}

                        {/* Dropdown menu para mais categorias */}
                        {extraCategories.length > 0 && (
                            <div className="relative group/dropdown">
                                <button className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted flex items-center gap-1">
                                    Mais
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-[&:hover]/dropdown:w-1/2" />
                                </button>

                                <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl opacity-0 invisible group-[&:hover]/dropdown:opacity-100 group-[&:hover]/dropdown:visible transition-all duration-300 transform origin-top-right group-[&:hover]/dropdown:translate-y-0 translate-y-2 z-50">
                                    <div className="py-2 flex flex-col">
                                        {extraCategories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/${cat.slug}`}
                                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="w-px h-4 bg-border mx-2" />

                        <Link
                            href="/sobre"
                            className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
                        >
                            Sobre
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2" />
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {mounted && (
                            <Link href={isLoggedIn ? "/conta" : "/conta/login"}>
                                <button className="relative p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
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
                            <button className="relative p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                                <ShoppingBag className="w-5 h-5" />
                                {mounted && totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </button>
                        </Link>

                        <div className="w-px h-4 bg-border mx-1" />
                        <ThemeToggle />
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
