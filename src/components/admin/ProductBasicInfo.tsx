'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Category = {
    id: string
    name: string
}

interface ProductBasicInfoProps {
    product?: {
        name: string
        description?: string
        base_price: number
        category_id: string
        weight_kg?: number | null
        height_cm?: number | null
        width_cm?: number | null
        length_cm?: number | null
    }
    categories: Category[]
}

export function ProductBasicInfo({ product, categories }: ProductBasicInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="name">Nome do produto</Label>
                <Input id="name" name="name" defaultValue={product?.name} required />
            </div>

            <div>
                <Label htmlFor="description">Descricao</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={product?.description}
                    rows={4}
                    className="min-h-28 resize-y"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="base_price">Preco base (R$)</Label>
                    <Input
                        id="base_price"
                        name="base_price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={product?.base_price}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="category_id">Categoria</Label>
                    <select
                        id="category_id"
                        name="category_id"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        defaultValue={product?.category_id || ""}
                        required
                    >
                        <option value="" disabled>Selecione uma categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Dimensoes para frete</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                        Esses dados sao usados na cotacao do Melhor Envio.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="weight_kg">Peso (kg)</Label>
                        <Input
                            id="weight_kg"
                            name="weight_kg"
                            type="number"
                            step="0.001"
                            min="0.001"
                            defaultValue={product?.weight_kg ?? ""}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="length_cm">Comprimento (cm)</Label>
                        <Input
                            id="length_cm"
                            name="length_cm"
                            type="number"
                            step="0.01"
                            min="0.01"
                            defaultValue={product?.length_cm ?? ""}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="width_cm">Largura (cm)</Label>
                        <Input
                            id="width_cm"
                            name="width_cm"
                            type="number"
                            step="0.01"
                            min="0.01"
                            defaultValue={product?.width_cm ?? ""}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="height_cm">Altura (cm)</Label>
                        <Input
                            id="height_cm"
                            name="height_cm"
                            type="number"
                            step="0.01"
                            min="0.01"
                            defaultValue={product?.height_cm ?? ""}
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
