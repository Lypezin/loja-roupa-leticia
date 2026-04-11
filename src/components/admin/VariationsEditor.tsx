'use client'

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Variation = {
    size: string
    color: string
    stock_quantity: number
}

interface VariationsEditorProps {
    variations: Variation[]
    onAdd: () => void
    onRemove: (index: number) => void
    onChange: (index: number, field: keyof Variation, value: string | number) => void
}

export function VariationsEditor({ variations, onAdd, onRemove, onChange }: VariationsEditorProps) {
    return (
        <section className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Estoque</p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-950">Variações e disponibilidade</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Mantenha pelo menos uma variação válida para vender o produto. Tamanho ou cor já bastam para criar a linha.
                    </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={onAdd} className="cursor-pointer rounded-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar variação
                </Button>
            </div>

            <div className="mt-5 space-y-3">
                {variations.map((variation, index) => (
                    <div key={index} className="rounded-[1.3rem] border border-zinc-200 bg-zinc-50/70 p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Variação {index + 1}</p>
                                <p className="mt-1 text-sm text-zinc-500">Defina as combinações disponíveis e o estoque dessa opção.</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => onRemove(index)}
                                disabled={variations.length === 1}
                                aria-label={`Remover variação ${index + 1}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem]">
                            <div>
                                <Label className="mb-1 block text-xs text-zinc-500">Tamanho</Label>
                                <Input
                                    value={variation.size}
                                    placeholder="Ex.: P, M, G, 42"
                                    onChange={(e) => onChange(index, "size", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label className="mb-1 block text-xs text-zinc-500">Cor ou opção</Label>
                                <Input
                                    value={variation.color}
                                    placeholder="Ex.: Preto, Off white"
                                    onChange={(e) => onChange(index, "color", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label className="mb-1 block text-xs text-zinc-500">Estoque</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={variation.stock_quantity}
                                    onChange={(e) => onChange(index, "stock_quantity", parseInt(e.target.value, 10) || 0)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
