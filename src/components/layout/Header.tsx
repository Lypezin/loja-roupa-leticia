'use client'

import Link from "next/link"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { useCartStore } from "@/store/useCartStore"
import { createClient } from "@/lib/supabase/client"
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
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const displayCategories = categories.slice(0, 4)
    const extraCategories = categories.slice(4)

    return (
        <>
            <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
                ? "border-b border-white/40 bg-background/72 shadow-[0_10px_40px_rgba(60,42,23,0.08)] backdrop-blur-2xl"
                : "bg-transparent"
                }`}>
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="rounded-xl border border-transparent p-2 transition-colors hover:bg-white/50 lg:hidden"
                        >
                            <Menu className="h-5 w-5 text-foreground" />
                        </button>
                        <Link href="/" className="max-w-[120px] truncate text-base font-bold tracking-[-0.08em] text-foreground transition-opacity hover:opacity-70 xs:max-w-[180px] sm:max-w-none sm:text-lg lg:text-xl">
                            {storeName || "FASHION STORE"}
                        </Link>
                    </div>

                    <div className="mx-8 hidden max-w-md flex-1 lg:block">
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
