'use client'

import Image from "next/image"

type ProductThumbnailProps = {
    src: string
    alt: string
    sizes: string
    priority?: boolean
    className?: string
    imageClassName?: string
}

export function ProductThumbnail({
    src,
    alt,
    sizes,
    priority = false,
    className = "",
    imageClassName = "",
}: ProductThumbnailProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={src}
                alt=""
                fill
                aria-hidden="true"
                className="scale-110 object-cover object-center blur-xl saturate-[1.08]"
                sizes={sizes}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_58%)]" />
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                className={`object-contain object-center ${imageClassName}`.trim()}
                sizes={sizes}
            />
        </div>
    )
}
