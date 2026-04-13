'use client'

import Image from "next/image"
import { ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"

interface CategoryFormProps {
    name: string
    setName: (val: string) => void
    imagePreview: string | null
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleCreate: (e: React.FormEvent) => void
    isLoading: boolean
    categoriesCount?: number
}

export function CategoryForm({
    name,
    setName,
    imagePreview,
    handleImageChange,
    handleCreate,
    isLoading,
}: CategoryFormProps) {
    return (
        <form
            onSubmit={handleCreate}
            className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-zinc-950">
                    Nova categoria
                </h2>
                <p className="text-sm text-zinc-500">
                    Crie uma nova coleção para organizar seus produtos.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-900">
                        Nome
                    </label>
                    <Input
                        id="name"
                        placeholder="Ex.: camisetas, vestidos, acessórios"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-10"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-900">
                        Capa (opcional)
                    </label>
                    <div className="group relative flex h-40 w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-zinc-400">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Pré-visualização da categoria" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/5" />
                                <div className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-zinc-900 shadow-sm">
                                    Alterar capa
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-center">
                                <ImageIcon className="h-6 w-6 text-zinc-400" />
                                <span className="text-sm text-zinc-600">Suba uma imagem (PNG, JPG, WEBP ou AVIF)</span>
                            </div>
                        )}
                        <input
                            id="image"
                            type="file"
                            accept={ACCEPTED_IMAGE_INPUT}
                            onChange={handleImageChange}
                            disabled={isLoading}
                            className="absolute inset-0 cursor-pointer opacity-0"
                        />
                    </div>
                    <p className="text-xs leading-5 text-zinc-500">
                        Limite de 5 MB por imagem. Se o arquivo vier direto do celular, vale reduzir antes de enviar.
                    </p>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="w-full"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                    </>
                ) : (
                    "Criar categoria"
                )}
            </Button>
        </form>
    )
}
