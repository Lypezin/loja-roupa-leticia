'use client'

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
    images: {
        image_url: string
        is_primary: boolean
    }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
    if (!images || images.length === 0) {
        images = [{ image_url: "/placeholder-image.jpg", is_primary: true }]
    }

    const primaryImage = images.find(img => img.is_primary)?.image_url || images[0].image_url
    const [selectedImage, setSelectedImage] = useState(primaryImage)

    return (
        <div className="flex flex-col gap-4">
            {/* Imagem em Destaque */}
            <div className="relative aspect-[3/4] w-full bg-zinc-100 rounded-2xl overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                    style={{ backgroundImage: `url(${selectedImage})` }}
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(img.image_url)}
                            className={`relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-100 border-2 transition-all ${selectedImage === img.image_url
                                ? "border-zinc-900 shadow-md transform scale-105"
                                : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${img.image_url})` }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
