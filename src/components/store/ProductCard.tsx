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

import { ProductCardImage } from "./ProductCardImage"

export function ProductCard({ product, index = 0 }: { product: Product, index?: number }) {
    const images = product.images && product.images.length > 0
        ? [...product.images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
        : [{ image_url: "/placeholder-image.jpg", is_primary: true }]

    const [currentIndex, setCurrentIndex] = useState(0)
    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8, scale: 1.02 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.05, duration: 0.5 }} className="group relative flex flex-col gap-3">
            <Link href={`/produto/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">Ver {product.name}</span></Link>

            <ProductCardImage 
                images={images} productName={product.name} currentIndex={currentIndex} 
                onNext={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(prev => (prev + 1) % images.length) }}
                onPrev={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(prev => (prev - 1 + images.length) % images.length) }}
                onSelect={(idx, e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx) }}
                isPriority={index < 4}
            />

            <Link href={`/produto/${product.id}`} className="flex flex-col gap-1.5 px-2 z-10">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">{product.category?.name || "Premium"}</p>
                    <span className="text-[10px] glass px-2 py-0.5 rounded-full font-bold text-zinc-500">Novo</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground/90 truncate">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-foreground">{formattedPrice}</p>
                    <span className="text-xs text-muted-foreground line-through opacity-50 text-sm">R$ {(product.base_price * 1.2).toFixed(2)}</span>
                </div>
            </Link>
        </motion.div>
    )
}
