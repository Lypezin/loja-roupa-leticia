'use client'

import Link from "next/link"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { MobileMenu } from "./MobileMenu"
import { SearchBar } from "./SearchBar"
import { DesktopNav } from "./DesktopNav"
import { UserActions } from "./UserActions"

export interface Category {
    id: string
    name: string
    slug: string
}

export function Header({
    categories = [],
    storeName,
    isLoggedIn = false,
}: {
    categories?: Category[]
    storeName?: string
    isLoggedIn?: boolean
}) {
    const [mobileMenu, setMobileMenu] = useState(false)

    useEffect(() => {
        const originalOverflow = document.body.style.overflow
        const originalPaddingRight = document.body.style.paddingRight

        if (mobileMenu) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = "hidden"
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`
            }
        } else {
            document.body.style.overflow = ""
            document.body.style.paddingRight = ""
        }

        return () => {
            document.body.style.overflow = originalOverflow
            document.body.style.paddingRight = originalPaddingRight
        }
    }, [mobileMenu])

    const displayCategories = categories.slice(0, 3)
    const extraCategories = categories.slice(3)

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 shadow-[0_10px_30px_rgba(61,44,32,0.04)] backdrop-blur-xl">
                <div className="container mx-auto flex h-[4.5rem] items-center justify-between gap-3 px-4 transition-[height,padding] duration-300 md:h-20">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setMobileMenu(true)}
                            aria-label="Abrir menu"
                            aria-controls="store-mobile-menu"
                            aria-expanded={mobileMenu}
                            aria-haspopup="dialog"
                            className="interactive-icon interactive-press rounded-full border border-border bg-card p-2.5 text-foreground hover:bg-accent lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <Link href="/" className="min-w-0">
                            <span className="eyebrow mb-2 hidden md:inline-flex">loja online</span>
                            <span className="block max-w-[150px] truncate font-display text-[1.4rem] leading-none text-foreground sm:max-w-none md:text-[1.8rem]">
                                {storeName || "Loja"}
                            </span>
                        </Link>
                    </div>

                    <div className="mx-4 hidden max-w-md flex-1 lg:block">
                        <SearchBar />
                    </div>

                    <DesktopNav displayCategories={displayCategories} extraCategories={extraCategories} />

                    <UserActions isLoggedIn={isLoggedIn} />
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
