'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

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
        <div className="border-t pt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Variações e Estoque</h3>
                <Button type="button" variant="outline" size="sm" onClick={onAdd} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Variação
                </Button>
            </div>

            <div className="space-y-3">
                {variations.map((variation, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                        <div className="flex-1">
                            <Label className="text-xs mb-1 block text-zinc-500">Tamanho / Vol</Label>
                            <Input
                                value={variation.size}
                                placeholder="Ex: P, 42, 100ml"
                                onChange={(e) => onChange(index, "size", e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs mb-1 block text-zinc-500">Cor / Tipo</Label>
                            <Input
                                value={variation.color}
                                placeholder="Ex: Preto, Couro, EDP"
                                onChange={(e) => onChange(index, "color", e.target.value)}
                            />
                        </div>
                        <div className="w-24">
                            <Label className="text-xs mb-1 block text-zinc-500">Estoque</Label>
                            <Input
                                type="number"
                                min="0"
                                value={variation.stock_quantity}
                                onChange={(e) => onChange(index, "stock_quantity", parseInt(e.target.value) || 0)}
                                required
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mt-5 text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => onRemove(index)}
                            disabled={variations.length === 1}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
