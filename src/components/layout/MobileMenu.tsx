'use client'

import Link from "next/link"
import { X, Search, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            onClose()
            setSearchQuery("")
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 shadow-2xl"
                    >
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-bold text-lg tracking-tight text-foreground truncate max-w-[200px]">
                                    {storeName || 'FASHION STORE'}
                                </span>
                                <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Barra de Busca Mobile */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar produtos..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </form>

                            <nav className="flex flex-col gap-1 flex-1">
                                {categories.map((cat, i) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={`/${cat.slug}`}
                                            onClick={onClose}
                                            className="block px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="w-full h-px bg-border my-2" />

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: categories.length * 0.05 }}
                                >
                                    <Link
                                        href="/sobre"
                                        onClick={onClose}
                                        className="block px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors"
                                    >
                                        Sobre
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (categories.length + 1) * 0.05 }}
                                >
                                    <Link
                                        href="/contato"
                                        onClick={onClose}
                                        className="block px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Contato
                                        </span>
                                    </Link>
                                </motion.div>
                            </nav>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
