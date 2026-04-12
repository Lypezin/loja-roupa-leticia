'use client'

import { Image as ImageIcon, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"
import { ProductImageCard } from "./ProductImageCard"

type ExistingImage = {
    id?: string
    image_url: string
    is_primary: boolean
    display_order?: number | null
}

interface ProductImageManagerProps {
    existingImages: ExistingImage[]
    onRemoveExisting: (index: number) => void
    onMoveExisting: (index: number, direction: "left" | "right") => void
    onSetPrimary: (index: number) => void
}

export function ProductImageManager({
    existingImages,
    onRemoveExisting,
    onMoveExisting,
    onSetPrimary,
}: ProductImageManagerProps) {
    const existingCountLabel = existingImages.length === 0
        ? "Nenhuma imagem cadastrada ainda."
        : `${existingImages.length} imagem(ns) vinculada(s) a este produto.`

    return (
        <section className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <ImageIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Imagens</p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-950">Galeria do produto</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Envie as fotos da vitrine e organize a ordem manualmente. A capa é a imagem principal do produto.
                    </p>
                </div>
            </div>

            <p className="mt-5 text-sm text-zinc-500">{existingCountLabel}</p>

            {existingImages.length > 0 && (
                <div className="mt-5">
                    <p className="mb-3 text-sm font-medium text-zinc-600">Ordem atual das imagens</p>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {existingImages.map((img, index) => (
                            <ProductImageCard
                                key={`${img.id ?? img.image_url}-${index}`}
                                img={img}
                                index={index}
                                isLast={index === existingImages.length - 1}
                                onRemove={onRemoveExisting}
                                onMove={onMoveExisting}
                                onSetPrimary={onSetPrimary}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 space-y-3">
                <Label htmlFor="images">Novas imagens</Label>
                <label
                    htmlFor="images"
                    className="flex cursor-pointer items-center justify-center gap-3 rounded-[1.2rem] border border-dashed border-zinc-300 bg-zinc-50/70 px-4 py-5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100/80"
                >
                    <Upload className="h-4 w-4" />
                    Selecionar arquivos
                </label>
                <Input
                    id="images"
                    name="images"
                    type="file"
                    accept={ACCEPTED_IMAGE_INPUT}
                    multiple
                    className="sr-only"
                />
                <p className="text-xs leading-5 text-zinc-500">
                    Formatos aceitos: JPG, PNG, WEBP, AVIF e GIF. Se algum upload falhar, o formulário avisa antes de salvar.
                </p>
            </div>
        </section>
    )
}
