'use client'

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { MobileSearch } from "./MobileSearch"
import { MobileNav } from "./MobileNav"

interface Category {
    id: string
    name: string
    slug: string
}

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    categories: Category[]
    storeName?: string
}

export function MobileMenu({ isOpen, onClose, categories, storeName }: MobileMenuProps) {
    const closeButtonRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        closeButtonRef.current?.focus()

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", handleEscape)

        return () => {
            window.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    return (
        <>
            <button
                type="button"
                aria-label="Fechar menu"
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />

            <aside
                id="store-mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="store-mobile-menu-title"
                className="animate-slide-in-soft fixed inset-y-0 left-0 z-[60] w-[21rem] max-w-[88vw] overflow-y-auto border-r border-border bg-background px-5 py-5 shadow-[0_24px_60px_rgba(43,32,24,0.18)]"
            >
                <div className="flex min-h-full flex-col">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <span className="eyebrow mb-2">menu</span>
                            <p id="store-mobile-menu-title" className="font-display text-[1.45rem] leading-none text-foreground">
                                {storeName || "FASHION STORE"}
                            </p>
                        </div>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Fechar menu"
                            className="rounded-full border border-border bg-card p-2.5 transition-colors hover:bg-accent"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <MobileSearch onClose={onClose} />
                    <MobileNav categories={categories} onClose={onClose} />

                    <div className="surface-card-soft mt-6 rounded-[1.4rem] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">atalho rapido</p>
                        <p className="mt-2 text-sm leading-6 text-foreground/80">
                            Use a busca ou escolha uma categoria para chegar mais rapido ao que voce quer.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
}
