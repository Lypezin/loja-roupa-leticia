'use client'

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type Product = {
    id: string
    name: string
    base_price: number
    category?: { name: string }
    images?: { image_url: string, is_primary: boolean }[]
}

export function ProductCard({ product }: { product: Product }) {
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
        <div className="group relative flex flex-col gap-3">
            <Link href={`/produto/${product.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">Ver Produto {product.name}</span>
            </Link>

            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100/50 rounded-xl z-10">
                {/* Imagens do Carrossel */}
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'} group-hover:scale-105 pointer-events-none`}
                        style={{ backgroundImage: `url(${img.image_url})` }}
                    />
                ))}

                {/* Sombreado de Proteção e Setas de Navegação (Aparecem no Hover) */}
                {images.length > 1 && (
                    <>
                        {/* Previne clique indesejado no div inteiro para não navegar a tela */}
                        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto">
                                <button
                                    onClick={prevImage}
                                    className="p-1.5 rounded-full bg-white/80 text-zinc-800 hover:bg-white hover:scale-110 shadow-sm transition-all focus:outline-none"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto">
                                <button
                                    onClick={nextImage}
                                    className="p-1.5 rounded-full bg-white/80 text-zinc-800 hover:bg-white hover:scale-110 shadow-sm transition-all focus:outline-none"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Indicadores estilo Instagram */}
                        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-auto">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setCurrentIndex(idx)
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <Link href={`/produto/${product.id}`} className="flex flex-col gap-1 px-1 z-10">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
                    {product.category?.name || "Sem Categoria"}
                </p>
                <h3 className="text-zinc-900 font-medium leading-tight">
                    {product.name}
                </h3>
                <p className="text-zinc-900 font-semibold mt-1">
                    {formattedPrice}
                </p>
            </Link>
        </div>
    )
}
