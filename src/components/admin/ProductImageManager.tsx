'use client'

import { ArrowLeft, ArrowRight, Image as ImageIcon, Star, Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"

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
                            <div key={`${img.id ?? img.image_url}-${index}`} className="overflow-hidden rounded-[1.2rem] border border-zinc-200 bg-zinc-50/70">
                                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${img.image_url})` }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onRemoveExisting(index)}
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
                                            onClick={() => onMoveExisting(index, "left")}
                                            disabled={index === 0}
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5" />
                                            Antes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onMoveExisting(index, "right")}
                                            disabled={index === existingImages.length - 1}
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
                                        >
                                            Depois
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
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
