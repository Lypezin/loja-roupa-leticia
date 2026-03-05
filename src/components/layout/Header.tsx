'use client'

import Link from "next/link"
import { ShoppingBag, Menu, User, X } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
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

    const navLinks = [
        { href: "/camisetas", label: "Camisetas" },
        { href: "/calcas", label: "Calças" },
        { href: "/acessorios", label: "Acessórios" },
        { href: "/sobre", label: "Sobre" },
    ]

    return (
        <>
            <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
                ? 'bg-white/70 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)] border-b border-zinc-200/50'
                : 'bg-transparent'
                }`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo + Mobile Menu */}
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
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100/60 group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-zinc-900 rounded-full transition-all duration-300 group-hover:w-1/2" />
                            </Link>
                        ))}
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenu(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-bold text-lg tracking-tight">FASHION STORE</span>
                                    <button onClick={() => setMobileMenu(false)} className="p-2 rounded-lg hover:bg-zinc-100">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link, i) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setMobileMenu(false)}
                                                className="block px-4 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
