'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { saveProduct } from "@/app/admin/(dashboard)/produtos/actions"
import { uploadProductImages } from "@/lib/utils/product-upload"
import { ProductBasicInfo } from "./ProductBasicInfo"
import { ProductImageManager } from "./ProductImageManager"
import { VariationsEditor } from "./VariationsEditor"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return 'Falha ao salvar produto.'
}

type Category = { id: string; name: string }
type Variation = { size: string; color: string; stock_quantity: number }
type ExistingImage = { id?: string; image_url: string; is_primary: boolean }
type ProductData = {
    id: string; name: string; description?: string; base_price: number;
    category_id: string; is_active: boolean; variations?: Variation[]; images?: ExistingImage[];
}

interface ProductFormProps { categories: Category[]; product?: ProductData | null }

function sanitizeVariation(variation: Variation) {
    return {
        size: variation.size.trim(),
        color: variation.color.trim(),
        stock_quantity: Number.isFinite(variation.stock_quantity) ? Math.max(0, variation.stock_quantity) : 0,
    }
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const router = useRouter()
    const isEditing = !!product
    const [isLoading, setIsLoading] = useState(false)
    const [variations, setVariations] = useState<Variation[]>(product?.variations || [{ size: "", color: "", stock_quantity: 0 }])
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(product?.images || [])

    const handleVariationChange = (index: number, field: keyof Variation, value: string | number) => {
        const newVariations = [...variations]
        newVariations[index] = { ...newVariations[index], [field]: value }
        setVariations(newVariations)
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const sanitizedVariations = variations
                .map(sanitizeVariation)
                .filter((variation) => variation.size || variation.color)

            if (sanitizedVariations.length === 0) {
                throw new Error('Adicione pelo menos uma variação com tamanho ou cor antes de salvar.')
            }

            formData.append('variations_json', JSON.stringify(sanitizedVariations))
            if (isEditing) {
                formData.append('product_id', product.id)
            }

            const fileInput = document.getElementById('images') as HTMLInputElement | null
            const uploadedUrls = await uploadProductImages(fileInput?.files ?? null, product?.id || 'new')
            if (uploadedUrls.length > 0) {
                formData.append('uploaded_image_urls', JSON.stringify(uploadedUrls))
            }

            formData.append('existing_images_json', JSON.stringify(existingImages))
            formData.delete('images')

            const res = await saveProduct(formData)
            if (res?.error) {
                throw new Error(res.error)
            }

            toast.success(isEditing ? "Produto atualizado com sucesso." : "Produto criado com sucesso.")
            router.push('/admin/produtos')
            router.refresh()
        } catch (error: unknown) {
            toast.error(`Erro: ${getErrorMessage(error)}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="max-w-2xl space-y-8 rounded-xl border bg-white p-6">
            <fieldset disabled={isLoading} className="space-y-8 disabled:opacity-95">
                <ProductBasicInfo product={product || undefined} categories={categories} />

                <ProductImageManager existingImages={existingImages} onRemoveExisting={(idx) => setExistingImages((prev) => prev.filter((_, i) => i !== idx))} />

                <div className="flex items-center gap-2 border-t pt-4">
                    <input type="checkbox" id="is_active" name="is_active" defaultChecked={product ? product.is_active : true} value="true" className="h-4 w-4 cursor-pointer rounded border-gray-300" />
                    <Label htmlFor="is_active" className="cursor-pointer">Produto ativo e visível na loja</Label>
                </div>

                <VariationsEditor variations={variations} onAdd={() => setVariations([...variations, { size: "", color: "", stock_quantity: 0 }])} onRemove={(idx) => setVariations(variations.filter((_, i) => i !== idx))} onChange={handleVariationChange} />

                <div className="border-t pt-6">
                    <Button disabled={isLoading} type="submit" className="h-12 w-full bg-zinc-950 text-base text-white">
                        {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Salvando produto...</> : (isEditing ? "Atualizar produto" : "Criar produto")}
                    </Button>
                </div>
            </fieldset>
        </form>
    )
}
