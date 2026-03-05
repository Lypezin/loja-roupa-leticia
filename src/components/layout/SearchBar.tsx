'use client'

import { useState, useEffect, useRef } from "react"
import { Search, Loader2, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SearchBar() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const searchProducts = async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            const supabase = createClient()

            const { data } = await supabase
                .from('products')
                .select('id, name, base_price, product_images(image_url)')
                .ilike('name', `%${query}%`)
                .limit(5)

            setResults(data || [])
            setIsLoading(false)
            setIsOpen(true)
        }

        const timer = setTimeout(searchProducts, 300)
        return () => clearTimeout(timer)
    }, [query])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
            setIsOpen(false)
        }
    }

    return (
        <div className="relative w-full max-w-sm" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="w-full h-10 pl-10 pr-4 bg-muted/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                )}
            </form>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="p-2 space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground px-3 py-1 uppercase tracking-widest">Sugestões</p>
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/produto/${product.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                                        <img
                                            src={product.product_images?.[0]?.image_url || "/placeholder.jpg"}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full p-3 bg-muted/50 text-center text-xs font-bold text-foreground hover:bg-muted transition-colors border-t border-border"
                        >
                            Ver todos os resultados para "{query}"
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
