'use client'

import Image from "next/image"

type ProductCardImageProps = {
    images: Array<{ image_url: string; is_primary?: boolean | null }>
    productName: string
    isPriority: boolean
    showSecondaryImage?: boolean
}

export function ProductCardImage({ images, productName, isPriority, showSecondaryImage = false }: ProductCardImageProps) {
    const primaryImage = images[0]?.image_url || "/placeholder-image.jpg"
    const secondaryImage = images[1]?.image_url

    return (
        <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,rgba(245,240,232,0.92),rgba(237,229,219,0.96))] p-2.5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_55%)]" />
            
            <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                    src={primaryImage}
                    alt={productName}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
                    priority={isPriority}
                    quality={82}
                />

                {secondaryImage && showSecondaryImage && (
                    <Image
                        src={secondaryImage}
                        alt={`${productName} detalhe`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        quality={82}
                    />
                )}
            </div>

            <div className="absolute inset-0 rounded-[1.45rem] border border-white/50 pointer-events-none" />
        </div>
    )
}
