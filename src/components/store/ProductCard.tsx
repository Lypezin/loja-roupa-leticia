'use client'

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { ProductCardImage } from "./ProductCardImage"

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
    const formattedPrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.base_price)

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group relative flex flex-col gap-3 rounded-[1.8rem] border border-white/35 bg-white/60 p-3 shadow-[0_22px_50px_rgba(94,70,47,0.08)] backdrop-blur-sm dark:border-white/8 dark:bg-white/4 dark:shadow-[0_22px_50px_rgba(0,0,0,0.22)]"
        >
            <Link href={`/produto/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">Ver {product.name}</span></Link>

            <ProductCardImage
                images={images}
                productName={product.name}
                currentIndex={currentIndex}
                onNext={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length) }}
                onPrev={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length) }}
                onSelect={(idx, e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx) }}
                isPriority={index < 4}
            />

            <Link href={`/produto/${product.id}`} className="z-10 flex flex-col gap-1.5 px-2 pb-2">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{product.category?.name || "Premium"}</p>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-900 dark:bg-amber-200/10 dark:text-amber-200">Novo</span>
                </div>
                <h3 className="truncate text-xl font-bold tracking-tight text-foreground/90">{product.name}</h3>
                <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-foreground">{formattedPrice}</p>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Ver peca</span>
                </div>
            </Link>
        </motion.div>
    )
}
