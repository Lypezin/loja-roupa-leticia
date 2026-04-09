'use client'

import Image from "next/image"
import { ImageIcon, Loader2, Plus } from "lucide-react"
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
        <form onSubmit={handleCreate} className="sticky top-6 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
                    <Plus className="h-4 w-4 text-primary-foreground" />
                </div>
                <h2 className="font-bold text-foreground">Nova categoria</h2>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Nome da categoria
                    </label>
                    <Input
                        id="name"
                        placeholder="Ex: Tênis, camisetas..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-11 rounded-xl bg-background"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Imagem de capa
                    </label>
                    <div className="group relative flex h-32 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-border/80">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <ImageIcon className="h-6 w-6 text-white" />
                                </div>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="mb-1 h-6 w-6 text-muted-foreground/50" />
                                <span className="text-[10px] font-medium text-muted-foreground">PNG ou JPG (800x400 recomendado)</span>
                            </>
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
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="h-11 w-full rounded-xl shadow-sm transition-all"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                    </>
                ) : (
                    <>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar coleção
                    </>
                )}
            </Button>
        </form>
    )
}
