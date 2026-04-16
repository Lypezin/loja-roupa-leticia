'use client'

import Link from "next/link"
import { useState } from "react"
import { getProductPath } from "@/lib/products"
import { ProductCardImage } from "./ProductCardImage"

type ProductImage = {
    image_url: string
    is_primary?: boolean | null
    display_order?: number | null
}

export type Product = {
    id: string
    slug: string
    name: string
    base_price: number
    category?: { name?: string | null } | null
    images?: ProductImage[]
}

function sortProductImages(images: ProductImage[]) {
    return [...images].sort((a, b) => {
        const primaryDelta = Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))
        if (primaryDelta !== 0) {
            return primaryDelta
        }

        const orderA = typeof a.display_order === "number" ? a.display_order : Number.MAX_SAFE_INTEGER
        const orderB = typeof b.display_order === "number" ? b.display_order : Number.MAX_SAFE_INTEGER
        return orderA - orderB
    })
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
    const [showSecondaryImage, setShowSecondaryImage] = useState(false)
    const images = product.images && product.images.length > 0
        ? sortProductImages(product.images)
        : [{ image_url: "/placeholder-image.jpg", is_primary: true }]

    const formattedPrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.base_price)
    const delayClass = index === 0 ? "" : index === 1 ? "animate-enter-delay-1" : index === 2 ? "animate-enter-delay-2" : "animate-enter-delay-3"

    return (
        <article className={`group surface-card hover-lift-soft interactive-panel animate-enter-soft flex h-full flex-col rounded-[1.85rem] p-3 ${delayClass}`}>
            <Link
                href={getProductPath(product.slug)}
                className="flex h-full flex-col rounded-[1.45rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                onMouseEnter={() => setShowSecondaryImage(true)}
                onFocus={() => setShowSecondaryImage(true)}
                onMouseLeave={() => setShowSecondaryImage(false)}
                onBlur={() => setShowSecondaryImage(false)}
            >
                <ProductCardImage
                    images={images}
                    productName={product.name}
                    isPriority={index < 2}
                    showSecondaryImage={showSecondaryImage}
                />

                <div className="flex min-w-0 flex-1 flex-col px-2 pb-2 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {product.category?.name || "produto"}
                    </p>
                    <h3 className="mt-3 font-display text-[1.55rem] leading-tight text-foreground sm:text-[1.7rem]">
                        {product.name}
                    </h3>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                        <p className="text-lg font-semibold text-foreground">{formattedPrice}</p>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            ver peça
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    )
}
