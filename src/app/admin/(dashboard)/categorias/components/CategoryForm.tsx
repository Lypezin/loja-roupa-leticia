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
    categoriesCount = 0,
}: CategoryFormProps) {
    return (
        <form
            onSubmit={handleCreate}
            className="space-y-6 rounded-[1.8rem] border border-zinc-200/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6"
        >
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Nova coleção
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-zinc-950">
                            Criar categoria
                        </h2>
                    </div>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-500">
                        {categoriesCount} cadastrada(s)
                    </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600">
                    Defina um nome claro e uma capa consistente. Essa imagem ajuda a leitura da vitrine e da navegação.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-900">
                        Nome
                    </label>
                    <Input
                        id="name"
                        placeholder="Ex.: Camisetas, vestidos, acessórios"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-11 rounded-2xl border-zinc-200 bg-zinc-50/70"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-900">
                        Capa da categoria
                    </label>
                    <div className="group relative flex h-44 w-full flex-col items-center justify-center overflow-hidden rounded-[1.3rem] border border-dashed border-zinc-300 bg-zinc-50/80 transition-colors hover:border-zinc-400 hover:bg-zinc-100/80">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Pré-visualização da categoria" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/8" />
                                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm">
                                    Alterar capa
                                </div>
                            </>
                        ) : (
                            <div className="flex max-w-[16rem] flex-col items-center gap-2 text-center">
                                <ImageIcon className="h-6 w-6 text-zinc-400" />
                                <span className="text-sm font-medium text-zinc-700">
                                    Selecione uma imagem em PNG, JPG, WEBP ou AVIF
                                </span>
                                <span className="text-xs leading-5 text-zinc-500">
                                    Use uma foto limpa, com bom corte, para a coleção aparecer bem na vitrine.
                                </span>
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
                        Limite de 5 MB por imagem. Se o arquivo vier do celular, vale reduzir antes de enviar.
                    </p>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="h-11 w-full rounded-full bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
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
