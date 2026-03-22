'use client'

import Link from "next/link"
import { ShoppingBag, Menu, User, ChevronDown } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { MobileMenu } from "./MobileMenu"
import { SearchBar } from "./SearchBar"
import { DesktopNav } from "./DesktopNav"
import { UserActions } from "./UserActions"

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
                        <Link href="/" className="font-bold text-base sm:text-lg lg:text-xl tracking-[-0.05em] text-foreground hover:opacity-70 transition-opacity truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                            {storeName || 'FASHION STORE'}
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:block flex-1 max-w-md mx-8">
                        <SearchBar />
                    </div>

                    <DesktopNav displayCategories={displayCategories} extraCategories={extraCategories} />

                    <UserActions mounted={mounted} isLoggedIn={isLoggedIn} totalItems={totalItems} />
                </div>
            </header>

            <MobileMenu
                isOpen={mobileMenu}
                onClose={() => setMobileMenu(false)}
                categories={categories}
                storeName={storeName}
            />
        </>
    )
}
