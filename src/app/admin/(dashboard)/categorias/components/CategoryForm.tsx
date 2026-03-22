'use client'

import { Plus, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface CategoryFormProps {
    name: string;
    setName: (val: string) => void;
    imagePreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCreate: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export function CategoryForm({ 
    name, 
    setName, 
    imagePreview, 
    handleImageChange, 
    handleCreate, 
    isLoading 
}: CategoryFormProps) {
    return (
        <form onSubmit={handleCreate} className="bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                    <Plus className="w-4 h-4 text-primary-foreground" />
                </div>
                <h2 className="font-bold text-foreground">Nova Categoria</h2>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Nome da Categoria
                    </label>
                    <Input
                        id="name"
                        placeholder="Ex: Tênis, Camisetas..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-11 rounded-xl bg-background"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Imagem de Capa
                    </label>
                    <div className="group relative w-full h-32 rounded-xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden hover:border-border/80 transition-colors">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-white" />
                                </div>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-6 h-6 text-muted-foreground/50 mb-1" />
                                <span className="text-[10px] text-muted-foreground font-medium">PNG ou JPG (800x400 recomendado)</span>
                            </>
                        )}
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isLoading}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="w-full h-11 rounded-xl shadow-sm transition-all"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                    <Plus className="w-4 h-4 mr-2" />
                )}
                Criar Coleção
            </Button>
        </form>
    )
}
