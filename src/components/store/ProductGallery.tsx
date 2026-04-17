'use client'

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"

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
    const [isZoomed, setIsZoomed] = useState(false)
    const hasMultipleImages = galleryImages.length > 1

    const showPreviousImage = () => {
        setSelectedIndex((currentIndex) => (
            currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
        ))
    }

    const showNextImage = () => {
        setSelectedIndex((currentIndex) => (
            currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
        ))
    }

    return (
        <>
            <div className="paper-panel relative w-full min-w-0 overflow-hidden rounded-[1.6rem] p-2.5 md:self-start md:rounded-[2rem] md:p-3">
                <button
                    type="button"
                    onClick={() => setIsZoomed(true)}
                    aria-label={`Ampliar imagem de ${productName}`}
                    className="interactive-press absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/65 bg-white/84 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-white md:right-6 md:top-6"
                >
                    <Expand className="h-4 w-4" />
                </button>

                {hasMultipleImages && (
                    <>
                        <button
                            type="button"
                            onClick={showPreviousImage}
                            aria-label={`Ver foto anterior de ${productName}`}
                            className="interactive-press absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/65 bg-white/84 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-white md:left-6 md:h-12 md:w-12"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            type="button"
                            onClick={showNextImage}
                            aria-label={`Ver proxima foto de ${productName}`}
                            className="interactive-press absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/65 bg-white/84 text-foreground/80 shadow-sm backdrop-blur-sm hover:bg-white md:right-6 md:h-12 md:w-12"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(245,240,232,0.92),rgba(237,229,219,0.96))] md:rounded-[1.6rem]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_58%)]" />
                    <Image
                        src={galleryImages[selectedIndex]?.image_url || "/placeholder-image.jpg"}
                        alt={productName}
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 52vw"
                        quality={88}
                    />
                </div>

                <div className="absolute left-5 top-5 rounded-full border border-white/60 bg-white/84 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-foreground/76 md:left-8 md:top-8 md:px-4 md:py-2 md:text-[10px] md:tracking-[0.24em]">
                    detalhe
                </div>

                {hasMultipleImages && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {galleryImages.map((image, index) => (
                            <button
                                key={`${image.image_url}-${index}`}
                                type="button"
                                onClick={() => setSelectedIndex(index)}
                                aria-label={`Ver foto ${index + 1} de ${productName}`}
                                className={`h-2.5 rounded-full transition-all ${
                                    selectedIndex === index
                                        ? "w-8 bg-foreground"
                                        : "w-2.5 bg-foreground/25 hover:bg-foreground/45"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isZoomed && (
                <div
                    className="animate-fade-in-soft fixed inset-0 z-[80] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Imagem ampliada de ${productName}`}
                >
                    <button
                        type="button"
                        aria-label="Fechar imagem ampliada"
                        className="absolute inset-0"
                        onClick={() => setIsZoomed(false)}
                    />

                    <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgba(20,16,13,0.82)] p-3 md:rounded-[2rem] md:p-5">
                        <button
                            type="button"
                            onClick={() => setIsZoomed(false)}
                            aria-label="Fechar"
                            className="interactive-press absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 md:right-5 md:top-5"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {hasMultipleImages && (
                            <>
                                <button
                                    type="button"
                                    onClick={showPreviousImage}
                                    aria-label={`Ver foto anterior de ${productName}`}
                                    className="interactive-press absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 md:left-5 md:h-12 md:w-12"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={showNextImage}
                                    aria-label={`Ver proxima foto de ${productName}`}
                                    className="interactive-press absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 md:right-5 md:h-12 md:w-12"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}

                        <div className="relative h-[78vh] w-full">
                            <Image
                                src={galleryImages[selectedIndex]?.image_url || "/placeholder-image.jpg"}
                                alt={productName}
                                fill
                                className="object-contain object-center"
                                sizes="100vw"
                                quality={95}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
