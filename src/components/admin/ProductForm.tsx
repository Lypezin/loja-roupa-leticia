'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { saveProduct } from "@/app/admin/(dashboard)/produtos/actions"

type Category = {
    id: string
    name: string
}

type Variation = {
    size: string
    color: string
    stock_quantity: number
}

interface ProductFormProps {
    categories: Category[]
    product?: any // Tipagem flexível para simplificar a edição por enquanto
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const router = useRouter()
    const isEditing = !!product

    const [isLoading, setIsLoading] = useState(false)
    const [variations, setVariations] = useState<Variation[]>(
        product?.variations || [{ size: "", color: "", stock_quantity: 0 }]
    )

    const handleAddVariation = () => {
        setVariations([...variations, { size: "", color: "", stock_quantity: 0 }])
    }

    const handleRemoveVariation = (index: number) => {
        setVariations(variations.filter((_, i) => i !== index))
    }

    const handleVariationChange = (index: number, field: keyof Variation, value: string | number) => {
        const newVariations = [...variations]
        newVariations[index] = { ...newVariations[index], [field]: value }
        setVariations(newVariations)
    }

    // Ação de envio do Form (chama a Server Action importada)
    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            // Passa as variacoes como string JSON pois FormData nao suporata arrays complexos diretos
            formData.append('variations_json', JSON.stringify(variations))

            if (isEditing) {
                formData.append('product_id', product.id)
            }

            await saveProduct(formData)
            router.push('/admin/produtos')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Erro ao salvar produto.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl bg-white p-6 rounded-xl border">

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

                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        defaultChecked={product ? product.is_active : true}
                        value="true"
                        className="w-4 h-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">Produto ativo e visível na loja</Label>
                </div>
            </div>

            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Variações e Estoque</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddVariation} className="cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Variação
                    </Button>
                </div>

                <div className="space-y-3">
                    {variations.map((variation, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                            <div className="flex-1">
                                <Label className="text-xs mb-1 block text-zinc-500">Tamanho</Label>
                                <Input
                                    value={variation.size}
                                    placeholder="Ex: P, M, 38"
                                    onChange={(e) => handleVariationChange(index, "size", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="text-xs mb-1 block text-zinc-500">Cor</Label>
                                <Input
                                    value={variation.color}
                                    placeholder="Ex: Preto, Azul"
                                    onChange={(e) => handleVariationChange(index, "color", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-24">
                                <Label className="text-xs mb-1 block text-zinc-500">Estoque</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={variation.stock_quantity}
                                    onChange={(e) => handleVariationChange(index, "stock_quantity", parseInt(e.target.value) || 0)}
                                    required
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mt-5 text-red-500 hover:text-red-700 cursor-pointer"
                                onClick={() => handleRemoveVariation(index)}
                                disabled={variations.length === 1}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t pt-6">
                <Button disabled={isLoading} type="submit" className="w-full bg-zinc-950 text-white cursor-pointer h-12">
                    {isLoading ? "Salvando..." : isEditing ? "Atualizar Produto" : "Criar Produto"}
                </Button>
            </div>

        </form>
    )
}
