'use client'

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function SearchBar() {
import { SearchResults } from "./SearchResults"

export function SearchBar() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const searchProducts = async () => {
            if (query.length < 2) { setResults([]); return }
            setIsLoading(true)
            const supabase = createClient()
            const { data } = await supabase.from('products').select('id, name, base_price, product_images(image_url)').ilike('name', `%${query}%`).limit(5)
            setResults(data || []); setIsLoading(false); setIsOpen(true)
        }
        const timer = setTimeout(searchProducts, 300)
        return () => clearTimeout(timer)
    }, [query])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query)}`); setIsOpen(false) }
    }

    return (
        <div className="relative w-full max-w-sm" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produtos..." className="w-full h-10 pl-10 pr-4 bg-muted/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all" />
                {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />}
            </form>
            <SearchResults results={results} isOpen={isOpen} query={query} onClose={() => setIsOpen(false)} onSearch={handleSearch} />
        </div>
    )
}
