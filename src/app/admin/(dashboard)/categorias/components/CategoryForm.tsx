'use client'

import Image from "next/image"
import { ImageIcon, Loader2, Plus, Upload } from "lucide-react"
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
    categoriesCount: number
}

export function CategoryForm({
    name,
    setName,
    imagePreview,
    handleImageChange,
    handleCreate,
    isLoading,
    categoriesCount,
}: CategoryFormProps) {
    return (
        <form
            onSubmit={handleCreate}
            className="space-y-5 rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)]"
        >
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                        <Plus className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Nova categoria
                        </p>
                        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                            Criar coleção
                        </h2>
                        <p className="text-sm leading-6 text-zinc-600">
                            Defina um nome claro e, se quiser, já suba uma capa para a vitrine.
                        </p>
                    </div>
                </div>

                <div className="rounded-[1.2rem] border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-600">
                    {categoriesCount === 0
                        ? "Sua primeira categoria ajuda a estruturar a navegação da loja."
                        : `${categoriesCount} categoria(s) já cadastrada(s). Evite nomes duplicados e prefira termos objetivos.`}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Nome da categoria
                    </label>
                    <Input
                        id="name"
                        placeholder="Ex.: Camisetas, vestidos, acessórios"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-11 rounded-2xl border-zinc-200 bg-zinc-50/60"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Imagem de capa
                    </label>
                    <div className="group relative flex h-40 w-full flex-col items-center justify-center overflow-hidden rounded-[1.4rem] border border-dashed border-zinc-300 bg-zinc-50/70 transition-colors hover:border-zinc-400">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Pré-visualização da categoria" fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10" />
                                <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-zinc-900">
                                    Alterar capa
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 px-6 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium text-zinc-700">Suba uma imagem horizontal para a coleção</p>
                                <p className="text-xs leading-5 text-zinc-500">PNG ou JPG. Recomendado: 1200x800 px.</p>
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

                    <label
                        htmlFor="image"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                        <Upload className="h-4 w-4" />
                        Escolher arquivo
                    </label>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="h-11 w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando categoria...
                    </>
                ) : (
                    <>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar categoria
                    </>
                )}
            </Button>
        </form>
    )
}
