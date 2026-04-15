'use client'

import { ArrowLeft, ArrowRight, Star, X } from "lucide-react"

type ExistingImage = {
    id?: string
    image_url: string
    is_primary: boolean
    display_order?: number | null
}

interface ImageCardProps {
    img: ExistingImage
    index: number
    isLast: boolean
    onRemove: (index: number) => void
    onMove: (index: number, direction: "left" | "right") => void
    onSetPrimary: (index: number) => void
}

export function ProductImageCard({
    img,
    index,
    isLast,
    onRemove,
    onMove,
    onSetPrimary
}: ImageCardProps) {
    return (
        <div className="overflow-hidden rounded-[1.2rem] border border-zinc-200 bg-zinc-50/70">
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${img.image_url}')` }}
                />
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500/95 p-1 text-white shadow-sm transition hover:bg-red-600"
                    aria-label="Remover imagem"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    #{index + 1}
                </span>
            </div>

            <div className="space-y-3 p-3">
                <button
                    type="button"
                    onClick={() => onSetPrimary(index)}
                    className={`flex w-full items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                        img.is_primary
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                >
                    <Star className={`h-3.5 w-3.5 ${img.is_primary ? "fill-current" : ""}`} />
                    {img.is_primary ? "Imagem de capa" : "Definir como capa"}
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => onMove(index, "left")}
                        disabled={index === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Antes
                    </button>
                    <button
                        type="button"
                        onClick={() => onMove(index, "right")}
                        disabled={isLast}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        Depois
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
