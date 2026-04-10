'use client'

import { Search } from "lucide-react"

export function SearchBar() {
    return (
        <form action="/search" className="group relative">
            <label htmlFor="desktop-store-search" className="sr-only">
                Buscar produtos
            </label>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
                id="desktop-store-search"
                type="search"
                name="q"
                aria-label="Buscar produtos"
                placeholder="Buscar por nome, cor ou categoria"
                className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
            <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
            >
                Buscar
            </button>
        </form>
    )
}
