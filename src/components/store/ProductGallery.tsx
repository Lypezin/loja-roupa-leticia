'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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

    const sortedImages = [...images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    const [selectedIndex, setSelectedIndex] = useState(0)

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails à esquerda no desktop / abaixo no mobile */}
            {sortedImages.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-2 md:pb-0">
                    {sortedImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`relative w-16 h-20 md:w-20 md:h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-100 transition-all duration-300 ${selectedIndex === i
                                ? "ring-2 ring-zinc-900 ring-offset-2 shadow-lg scale-[1.02]"
                                : "opacity-50 hover:opacity-100 hover:scale-[1.02]"
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

            {/* Imagem Principal com Zoom */}
            <div className="relative flex-1 aspect-[3/4] w-full bg-zinc-50 rounded-2xl overflow-hidden group cursor-crosshair">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${sortedImages[selectedIndex]?.image_url})` }}
                    />
                </AnimatePresence>

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-zinc-900 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-semibold shadow-lg">
                        Novo
                    </span>
                </div>
            </div>
        </div>
    )
}
