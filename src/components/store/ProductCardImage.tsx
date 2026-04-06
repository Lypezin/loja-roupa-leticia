import Image from "next/image"

type ProductCardImageProps = {
    images: Array<{ image_url: string; is_primary?: boolean | null }>
    productName: string
    isPriority: boolean
}

export function ProductCardImage({ images, productName, isPriority }: ProductCardImageProps) {
    const primaryImage = images[0]?.image_url || "/placeholder-image.jpg"
    const secondaryImage = images[1]?.image_url

    return (
        <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-muted">
            <Image
                src={primaryImage}
                alt={productName}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority={isPriority}
                quality={82}
            />

            {secondaryImage && (
                <Image
                    src={secondaryImage}
                    alt={`${productName} detalhe`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    quality={82}
                />
            )}

            <div className="absolute inset-0 rounded-[1.45rem] border border-white/50" />
        </div>
    )
}
