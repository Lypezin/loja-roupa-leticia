'use client'

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
    images: {
        image_url: string
        is_primary?: boolean | null
        display_order?: number | null
    }[]
    productName: string
}

function sortGalleryImages(images: ProductGalleryProps["images"]) {
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

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const galleryImages = images.length > 0
        ? sortGalleryImages(images)
        : [{ image_url: "/placeholder-image.jpg", is_primary: true }]

    const [selectedIndex, setSelectedIndex] = useState(0)

    return (
        <div className="flex self-start flex-col-reverse gap-4 md:flex-row md:items-start">
            {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 md:max-h-[620px] md:flex-col md:overflow-y-auto md:pb-0">
                    {galleryImages.map((image, index) => (
                        <button
                            key={`${image.image_url}-${index}`}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            aria-label={`Ver foto ${index + 1} de ${productName}`}
                            className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-[1rem] border transition-all md:h-24 md:w-20 ${
                                selectedIndex === index
                                    ? "border-primary shadow-[0_12px_28px_rgba(70,52,35,0.12)]"
                                    : "border-border opacity-70 hover:opacity-100"
                            }`}
                        >
                            <Image
                                src={image.image_url}
                                alt={`${productName} - foto ${index + 1}`}
                                fill
                                className="object-contain p-1"
                                sizes="(max-width: 768px) 64px, 80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            <div className="paper-panel relative min-w-0 flex-1 self-start overflow-hidden rounded-[2rem] p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-card">
                    <Image
                        src={galleryImages[selectedIndex]?.image_url || "/placeholder-image.jpg"}
                        alt={productName}
                        fill
                        priority
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 52vw"
                        quality={88}
                    />
                </div>
                <div className="absolute left-8 top-8 rounded-full border border-white/60 bg-white/84 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/76">
                    detalhe
                </div>
            </div>
        </div>
    )
}
