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
        <div className="flex self-start flex-col-reverse gap-3 md:flex-row md:items-start md:gap-4">
            {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 md:max-h-[620px] md:flex-col md:gap-3 md:overflow-y-auto md:pb-0">
                    {galleryImages.map((image, index) => (
                        <button
                            key={`${image.image_url}-${index}`}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            aria-label={`Ver foto ${index + 1} de ${productName}`}
                            className={`interactive-press relative h-[4.5rem] w-[3.75rem] shrink-0 overflow-hidden rounded-[0.95rem] border transition-all md:h-24 md:w-20 md:rounded-[1rem] ${
                                selectedIndex === index
                                    ? "border-primary shadow-[0_12px_28px_rgba(70,52,35,0.12)]"
                                    : "border-border opacity-70 hover:opacity-100"
                            }`}
                        >
                            <Image
                                src={image.image_url}
                                alt={`${productName} - foto ${index + 1}`}
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 64px, 80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            <div className="paper-panel relative min-w-0 flex-1 self-start overflow-hidden rounded-[1.6rem] p-2.5 md:rounded-[2rem] md:p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-card md:rounded-[1.6rem]">
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
                <div className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/84 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-foreground/76 md:left-8 md:top-8 md:px-4 md:py-2 md:text-[10px] md:tracking-[0.24em]">
                    detalhe
                </div>
            </div>
        </div>
    )
}
