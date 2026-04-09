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
                <Label htmlFor="name">Nome do produto</Label>
                <Input id="name" name="name" defaultValue={product?.name} required />
            </div>

            <div>
                <Label htmlFor="description">Descrição</Label>
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
                    <Label htmlFor="base_price">Preço base (R$)</Label>
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
        </div>
    )
}
