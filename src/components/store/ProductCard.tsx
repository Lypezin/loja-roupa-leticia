'use client'

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export type Product = {
    id: string
    name: string
    base_price: number
    category?: { name: string }
    images?: { image_url: string, is_primary: boolean }[]
}

export function ProductCard({ product, index = 0 }: { product: Product, index?: number }) {
    const images = product.images && product.images.length > 0
        ? [...product.images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
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
            whileHover={{ y: -8, scale: 1.02, rotateY: 5 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1000 }}
            className="group relative flex flex-col gap-3"
        >
            <Link href={`/produto/${product.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">Ver Produto {product.name}</span>
            </Link>

            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-3xl z-10 shadow-sm group-hover:shadow-2xl group-hover:shadow-black/10 transition-shadow duration-500">
                {/* Images with next/image optimization */}
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110'
                            }`}
                    >
                        <Image
                            src={img.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover rounded-3xl"
                            priority={index < 4}
                        />
                    </div>
                ))}

                {/* Overlays */}
                <div className="absolute inset-0 z-[11] group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[12]" />

                {/* Arrow Navigation */}
                {images.length > 1 && (
                    <>
                        <div className="absolute inset-0 z-20 opacity-0 md:group-hover:opacity-100 transition-all duration-500 pointer-events-none md:pointer-events-auto">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-auto">
                                <button
                                    onClick={prevImage}
                                    className="w-10 h-10 rounded-full glass text-zinc-800 dark:text-zinc-200 hover:scale-110 shadow-xl transition-all flex items-center justify-center"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto">
                                <button
                                    onClick={nextImage}
                                    className="w-10 h-10 rounded-full glass text-zinc-800 dark:text-zinc-200 hover:scale-110 shadow-xl transition-all flex items-center justify-center"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-auto">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setCurrentIndex(idx)
                                    }}
                                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Badges Glass */}
                <div className="absolute top-4 right-4 z-20 opacity-0 transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-lg">
                        <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover/fav:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <Link href={`/produto/${product.id}`} className="flex flex-col gap-1.5 px-2 z-10">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                        {product.category?.name || "Premium"}
                    </p>
                    <span className="text-[10px] glass px-2 py-0.5 rounded-full font-bold text-zinc-500">Novo</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors truncate">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-foreground">
                        {formattedPrice}
                    </p>
                    <span className="text-xs text-muted-foreground line-through opacity-50">R$ {(product.base_price * 1.2).toFixed(2)}</span>
                </div>
            </Link>
        </motion.div>
    )
}
