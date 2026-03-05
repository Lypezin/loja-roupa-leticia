'use client'

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export type Product = {
    id: string
    name: string
    base_price: number
    category?: { name: string }
    images?: { image_url: string, is_primary: boolean }[]
}

export function ProductCard({ product, index = 0 }: { product: Product, index?: number }) {
    const images = product.images && product.images.length > 0
        ? product.images.sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
        : [{ image_url: "/placeholder-image.jpg", is_primary: true }]

    const [currentIndex, setCurrentIndex] = useState(0)

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.base_price)

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col gap-3"
        >
            <Link href={`/produto/${product.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">Ver Produto {product.name}</span>
            </Link>

            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-2xl z-10">
                {/* Images */}
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
                            }`}
                        style={{ backgroundImage: `url(${img.image_url})` }}
                    />
                ))}

                {/* Hover Zoom Effect */}
                <div className="absolute inset-0 z-[11] group-hover:bg-black/5 transition-colors duration-300" />

                {/* Arrow Navigation */}
                {images.length > 1 && (
                    <>
                        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto">
                                <button
                                    onClick={prevImage}
                                    className="p-2 rounded-full bg-white/90 text-zinc-800 hover:bg-white hover:scale-110 shadow-lg backdrop-blur-sm transition-all focus:outline-none"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto">
                                <button
                                    onClick={nextImage}
                                    className="p-2 rounded-full bg-white/90 text-zinc-800 hover:bg-white hover:scale-110 shadow-lg backdrop-blur-sm transition-all focus:outline-none"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-auto">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setCurrentIndex(idx)
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-white shadow-md' : 'w-1.5 bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Wishlist-style Badge (Visual only for now) */}
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer pointer-events-auto">
                        <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <Link href={`/produto/${product.id}`} className="flex flex-col gap-1 px-1 z-10">
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em] font-medium">
                    {product.category?.name || "Sem Categoria"}
                </p>
                <h3 className="text-foreground font-medium leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-foreground font-semibold mt-0.5">
                    {formattedPrice}
                </p>
            </Link>
        </motion.div>
    )
}
