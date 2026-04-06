'use client'

import Link from "next/link"
import { X, Search, Phone } from "lucide-react"

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

            <aside className="fixed inset-y-0 left-0 z-[60] w-[21rem] max-w-[88vw] border-r border-border bg-background px-5 py-5 shadow-[0_24px_60px_rgba(43,32,24,0.18)]">
                <div className="flex h-full flex-col">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <span className="eyebrow mb-2">navegacao</span>
                            <p className="font-display text-[1.45rem] leading-none text-foreground">
                                {storeName || "FASHION STORE"}
                            </p>
                        </div>
                        <button onClick={onClose} className="rounded-full border border-border bg-card p-2.5 transition-colors hover:bg-accent">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form action="/search" onSubmit={onClose} className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                name="q"
                                placeholder="Buscar produtos"
                                className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                            />
                        </div>
                    </form>

                    <nav className="flex flex-1 flex-col gap-1">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/${cat.slug}`}
                                onClick={onClose}
                                className="rounded-[1rem] px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                                {cat.name}
                            </Link>
                        ))}

                        <div className="subtle-divider my-4" />

                        <Link
                            href="/sobre"
                            onClick={onClose}
                            className="rounded-[1rem] px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                            Sobre
                        </Link>

                        <Link
                            href="/contato"
                            onClick={onClose}
                            className="rounded-[1rem] px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                            <span className="flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Contato
                            </span>
                        </Link>
                    </nav>

                    <div className="surface-card-soft mt-6 rounded-[1.4rem] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">atalho rapido</p>
                        <p className="mt-2 text-sm leading-6 text-foreground/80">
                            Use a busca ou abra uma categoria para encontrar a peca com menos rolagem.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
}
