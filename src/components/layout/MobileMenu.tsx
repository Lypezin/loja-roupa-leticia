'use client'

import Link from "next/link"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Category {
    id: string
    name: string
    slug: string
}

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    categories: Category[]
}

export function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
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
                        className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-lg tracking-tight">FASHION STORE</span>
                                <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-1">
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
                                            className="block px-4 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="w-full h-px bg-zinc-100 my-2" />

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: categories.length * 0.05 }}
                                >
                                    <Link
                                        href="/sobre"
                                        onClick={onClose}
                                        className="block px-4 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors"
                                    >
                                        Sobre
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
