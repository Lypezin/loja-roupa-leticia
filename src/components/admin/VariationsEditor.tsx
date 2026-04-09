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
        <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Variações e estoque</h3>
                    <p className="text-sm text-zinc-500">Mantenha pelo menos uma variação válida para vender o produto.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={onAdd} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar variação
                </Button>
            </div>

            <div className="space-y-3">
                {variations.map((variation, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                        <div className="flex-1">
                            <Label className="mb-1 block text-xs text-zinc-500">Tamanho / vol</Label>
                            <Input
                                value={variation.size}
                                placeholder="Ex: P, 42, 100ml"
                                onChange={(e) => onChange(index, "size", e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <Label className="mb-1 block text-xs text-zinc-500">Cor / tipo</Label>
                            <Input
                                value={variation.color}
                                placeholder="Ex: Preto, Couro, EDP"
                                onChange={(e) => onChange(index, "color", e.target.value)}
                            />
                        </div>
                        <div className="w-24">
                            <Label className="mb-1 block text-xs text-zinc-500">Estoque</Label>
                            <Input
                                type="number"
                                min="0"
                                value={variation.stock_quantity}
                                onChange={(e) => onChange(index, "stock_quantity", parseInt(e.target.value, 10) || 0)}
                                required
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mt-5 cursor-pointer text-red-500 hover:text-red-700"
                            onClick={() => onRemove(index)}
                            disabled={variations.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
