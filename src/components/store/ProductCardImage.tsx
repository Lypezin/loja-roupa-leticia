'use client'

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductCardImageProps {
    images: any[];
    productName: string;
    currentIndex: number;
    onNext: (e: React.MouseEvent) => void;
    onPrev: (e: React.MouseEvent) => void;
    onSelect: (index: number, e: React.MouseEvent) => void;
    isPriority: boolean;
}

export function ProductCardImage({ images, productName, currentIndex, onNext, onPrev, onSelect, isPriority }: ProductCardImageProps) {
    return (
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-3xl z-10 shadow-sm group-hover:shadow-2xl transition-shadow duration-500">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110'}`}
                >
                    <Image src={img.image_url} alt={productName} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover rounded-3xl" priority={isPriority} />
                </div>
            ))}
            <div className="absolute inset-0 z-[11] group-hover:bg-black/10 transition-colors duration-500" />
            
            {images.length > 1 && (
                <>
                    <div className="absolute inset-0 z-20 opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                        <button onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 shadow-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 shadow-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                    <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5 z-20">
                        {images.map((_, idx) => (
                            <button key={idx} onClick={(e) => onSelect(idx, e)} className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
