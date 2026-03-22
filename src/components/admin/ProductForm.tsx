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

import { ProductBasicInfo } from "./ProductBasicInfo"
import { uploadProductImages } from "@/lib/utils/product-upload"

// types simplified for brevity
type Category = { id: string; name: string }
type Variation = { size: string; color: string; stock_quantity: number }
type ExistingImage = { id?: string; image_url: string; is_primary: boolean }
type ProductData = {
    id: string; name: string; description?: string; base_price: number;
    category_id: string; is_active: boolean; variations?: Variation[]; images?: ExistingImage[];
}

interface ProductFormProps { categories: Category[]; product?: ProductData | null }

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
            formData.append('variations_json', JSON.stringify(variations))
            if (isEditing) formData.append('product_id', product.id)

            const fileInput = document.getElementById('images') as HTMLInputElement
            const uploadedUrls = await uploadProductImages(fileInput?.files, product?.id || 'new')
            if (uploadedUrls.length > 0) formData.append('uploaded_image_urls', JSON.stringify(uploadedUrls))

            formData.append('existing_images_json', JSON.stringify(existingImages))
            formData.delete('images')

            const res = await saveProduct(formData)
            if (res?.error) throw new Error(res.error)

            toast.success(isEditing ? "Produto atualizado!" : "Produto criado!")
            router.push('/admin/produtos'); router.refresh()
        } catch (error: any) {
            toast.error(`Erro: ${error.message}`)
        } finally { setIsLoading(false) }
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-2xl bg-white p-6 rounded-xl border">
            <ProductBasicInfo product={product || undefined} categories={categories} />
            
            <ProductImageManager existingImages={existingImages} onRemoveExisting={(idx) => setExistingImages(prev => prev.filter((_, i) => i !== idx))} />

            <div className="flex items-center gap-2 pt-4 border-t">
                <input type="checkbox" id="is_active" name="is_active" defaultChecked={product ? product.is_active : true} value="true" className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
                <Label htmlFor="is_active" className="cursor-pointer">Produto ativo e visível na loja</Label>
            </div>

            <VariationsEditor variations={variations} onAdd={() => setVariations([...variations, { size: "", color: "", stock_quantity: 0 }])} onRemove={(idx) => setVariations(variations.filter((_, i) => i !== idx))} onChange={handleVariationChange} />

            <div className="border-t pt-6">
                <Button disabled={isLoading} type="submit" className="w-full bg-zinc-950 text-white h-12 text-base">
                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Salvando...</> : (isEditing ? "Atualizar Produto" : "Criar Produto")}
                </Button>
            </div>
        </form>
    )
}
