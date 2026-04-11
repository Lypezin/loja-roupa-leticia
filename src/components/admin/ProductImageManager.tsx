'use client'

import { Image as ImageIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"

type ExistingImage = {
    id?: string
    image_url: string
    is_primary: boolean
}

interface ProductImageManagerProps {
    existingImages: ExistingImage[]
    onRemoveExisting: (index: number) => void
}

export function ProductImageManager({ existingImages, onRemoveExisting }: ProductImageManagerProps) {
    const existingCountLabel = existingImages.length === 0
        ? "Nenhuma imagem cadastrada ainda."
        : `${existingImages.length} imagem(ns) vinculada(s) a este produto.`

    return (
        <section className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 md:p-6">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <ImageIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Imagens</p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-950">Galeria do produto</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Envie as fotos que vão aparecer na vitrine. A primeira imagem vira a capa quando ainda não existe nenhuma salva.
                    </p>
                </div>
            </div>

            <p className="mt-5 text-sm text-zinc-500">{existingCountLabel}</p>

            {existingImages.length > 0 && (
                <div className="mt-4">
                    <p className="mb-3 text-sm font-medium text-zinc-600">Imagens atuais</p>
                    <div className="flex flex-wrap gap-3">
                        {existingImages.map((img, index) => (
                            <div key={index} className="group relative h-24 w-20 overflow-hidden rounded-lg border-2 border-zinc-200">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${img.image_url})` }}
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveExisting(index)}
                                    className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label="Remover imagem"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                {img.is_primary && (
                                    <span className="absolute bottom-1 left-1 rounded-full bg-zinc-900 px-1.5 py-0.5 text-[9px] text-white">
                                        Capa
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-5 space-y-2">
                <Label htmlFor="images">Novas imagens</Label>
                <Input
                    id="images"
                    name="images"
                    type="file"
                    accept={ACCEPTED_IMAGE_INPUT}
                    multiple
                    className="cursor-pointer"
                />
                <p className="text-xs leading-5 text-zinc-500">
                    Formatos aceitos: JPG, PNG, WEBP, AVIF e GIF. Se algum upload falhar, o formulário agora avisa antes de salvar.
                </p>
            </div>
        </section>
    )
}
