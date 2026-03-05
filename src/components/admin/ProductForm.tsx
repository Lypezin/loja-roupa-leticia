'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { saveProduct } from "@/app/admin/(dashboard)/produtos/actions"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ProductImageManager } from "./ProductImageManager"
import { VariationsEditor } from "./VariationsEditor"

type Category = {
    id: string
    name: string
}

type Variation = {
    size: string
    color: string
    stock_quantity: number
}

type ExistingImage = {
    id?: string
    image_url: string
    is_primary: boolean
}

type ProductData = {
    id: string
    name: string
    description?: string
    base_price: number
    category_id: string
    is_active: boolean
    variations?: Variation[]
    images?: ExistingImage[]
}

interface ProductFormProps {
    categories: Category[]
    product?: ProductData | null
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const router = useRouter()
    const isEditing = !!product

    const [isLoading, setIsLoading] = useState(false)
    const [variations, setVariations] = useState<Variation[]>(
        product?.variations || [{ size: "", color: "", stock_quantity: 0 }]
    )
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(
        product?.images || []
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

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index))
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            formData.append('variations_json', JSON.stringify(variations))

            if (isEditing) {
                formData.append('product_id', product.id)
            }

            // Upload de imagens no client-side para evitar 400 na Vercel
            const fileInput = document.getElementById('images') as HTMLInputElement
            const files = fileInput?.files

            if (files && files.length > 0) {
                const supabase = createClient()
                const uploadedUrls: string[] = []

                for (let i = 0; i < files.length; i++) {
                    const file = files[i]
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${product?.id || 'new'}-${Date.now()}-${i}.${fileExt}`

                    const { error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(fileName, file)

                    if (uploadError) {
                        console.error("Erro no upload:", uploadError)
                        continue
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(fileName)

                    uploadedUrls.push(publicUrl)
                }

                formData.append('uploaded_image_urls', JSON.stringify(uploadedUrls))
            }

            // Enviar IDs das imagens existentes que foram mantidas
            formData.append('existing_images_json', JSON.stringify(existingImages))

            // Remover os files do FormData para não estourar payload
            formData.delete('images')

            const res = await saveProduct(formData)

            if (res?.error) {
                throw new Error(res.error)
            }

            toast.success(isEditing ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!")
            router.push('/admin/produtos')
            router.refresh()
        } catch (error: unknown) {
            const err = error as Error
            console.error(err)
            toast.error(`Erro ao salvar produto: ${err.message}`)
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

                <ProductImageManager
                    existingImages={existingImages}
                    onRemoveExisting={handleRemoveExistingImage}
                />

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        defaultChecked={product ? product.is_active : true}
                        value="true"
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">Produto ativo e visível na loja</Label>
                </div>
            </div>

            <VariationsEditor
                variations={variations}
                onAdd={handleAddVariation}
                onRemove={handleRemoveVariation}
                onChange={handleVariationChange}
            />

            <div className="border-t pt-6">
                <Button disabled={isLoading} type="submit" className="w-full bg-zinc-950 text-white cursor-pointer h-12 text-base">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Salvando e enviando imagens...
                        </span>
                    ) : isEditing ? "Atualizar Produto" : "Criar Produto"}
                </Button>
            </div>
        </form>
    )
}
