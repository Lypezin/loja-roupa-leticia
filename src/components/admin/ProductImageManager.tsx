'use client'

import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"
import { X, Image as ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    return (
        <div className="pt-4 border-t">
            <Label htmlFor="images" className="flex items-center gap-2 mb-2 font-semibold">
                <ImageIcon className="w-4 h-4 text-zinc-500" />
                Imagens do Produto
            </Label>

            {/* Imagens já cadastradas */}
            {existingImages.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-zinc-500 mb-2">Imagens atuais:</p>
                    <div className="flex gap-3 flex-wrap">
                        {existingImages.map((img, i) => (
                            <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden border-2 border-zinc-200 group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${img.image_url})` }}
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveExisting(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                {img.is_primary && (
                                    <span className="absolute bottom-1 left-1 bg-zinc-900 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                        Capa
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-sm text-zinc-500 mb-4">
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
