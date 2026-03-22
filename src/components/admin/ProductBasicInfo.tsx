'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Category = {
    id: string
    name: string
}

interface ProductBasicInfoProps {
    product?: {
        name: string;
        description?: string;
        base_price: number;
        category_id: string;
    };
    categories: Category[];
}

export function ProductBasicInfo({ product, categories }: ProductBasicInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" name="name" defaultValue={product?.name} required />
            </div>

            <div>
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" name="description" defaultValue={product?.description} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="base_price">Preço Base (R$)</Label>
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
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
