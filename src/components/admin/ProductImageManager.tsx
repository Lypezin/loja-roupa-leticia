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
        : `${existingImages.length} imagem(ns) atualmente vinculada(s) ao produto.`

    return (
        <div className="border-t pt-4">
            <Label htmlFor="images" className="mb-2 flex items-center gap-2 font-semibold">
                <ImageIcon className="h-4 w-4 text-zinc-500" />
                Imagens do produto
            </Label>

            <p className="mb-3 text-sm text-zinc-500">{existingCountLabel}</p>

            {existingImages.length > 0 && (
                <div className="mb-4">
                    <p className="mb-2 text-sm text-zinc-500">Imagens atuais:</p>
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

            <div className="mb-4 text-sm text-zinc-500">
                Selecione novas fotos para adicionar. A primeira será a capa se não houver imagens.
            </div>
            <Input
                id="images"
                name="images"
                type="file"
                accept={ACCEPTED_IMAGE_INPUT}
                multiple
                className="cursor-pointer"
            />
        </div>
    )
}
