import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { saveProduct } from "@/app/admin/(dashboard)/produtos/actions"
import { uploadProductImages } from "@/lib/utils/product-upload"
import { Variation, ExistingImage, ProductData } from "@/types/product"
import { sanitizeVariation, normalizeExistingImages, getErrorMessage } from "./ProductFormUtils"

export function useProductForm(product: ProductData | null | undefined) {
    const router = useRouter()
    const isEditing = !!product
    const [isLoading, setIsLoading] = useState(false)
    const [variations, setVariations] = useState<Variation[]>(
        product?.variations || [{ size: "", color: "", stock_quantity: 0 }]
    )
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(
        normalizeExistingImages(product?.images || [])
    )

    const handleVariationChange = (index: number, field: keyof Variation, value: string | number) => {
        const newVariations = [...variations]
        newVariations[index] = { ...newVariations[index], [field]: value }
        setVariations(newVariations)
    }

    const addVariation = () => setVariations([...variations, { size: "", color: "", stock_quantity: 0 }])
    const removeVariation = (idx: number) => setVariations(variations.filter((_, i) => i !== idx))

    const updateExistingImages = (updater: (images: ExistingImage[]) => ExistingImage[]) => {
        setExistingImages((currentImages) => normalizeExistingImages(updater(currentImages)))
    }

    const handleRemoveExistingImage = (index: number) => {
        updateExistingImages((currentImages) => currentImages.filter((_, currentIndex) => currentIndex !== index))
    }

    const handleMoveExistingImage = (index: number, direction: "left" | "right") => {
        updateExistingImages((currentImages) => {
            const nextIndex = direction === "left" ? index - 1 : index + 1
            if (nextIndex < 0 || nextIndex >= currentImages.length) return currentImages
            
            const nextImages = [...currentImages]
            const [movedImage] = nextImages.splice(index, 1)
            nextImages.splice(nextIndex, 0, movedImage)
            return nextImages
        })
    }

    const handleSetPrimaryImage = (index: number) => {
        updateExistingImages((currentImages) => currentImages.map((image, currentIndex) => ({
            ...image,
            is_primary: currentIndex === index,
        })))
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const sanitizedVariations = variations
                .map(sanitizeVariation)
                .filter((variation) => variation.size || variation.color)

            if (sanitizedVariations.length === 0) {
                throw new Error("Adicione pelo menos uma variação com tamanho ou cor antes de salvar.")
            }

            formData.append("variations_json", JSON.stringify(sanitizedVariations))
            if (isEditing && product) {
                formData.append("product_id", product.id)
            }

            const fileInput = document.getElementById("images") as HTMLInputElement | null
            const uploadedUrls = await uploadProductImages(fileInput?.files ?? null, product?.id || "new")
            if (uploadedUrls.length > 0) {
                formData.append("uploaded_image_urls", JSON.stringify(uploadedUrls))
            }

            formData.append("existing_images_json", JSON.stringify(existingImages))
            formData.delete("images")

            const res = await saveProduct(formData)
            if (res?.error) {
                throw new Error(res.error)
            }

            toast.success(isEditing ? "Produto atualizado com sucesso." : "Produto criado com sucesso.")
            router.push("/admin/produtos")
            router.refresh()
        } catch (error: unknown) {
            toast.error(`Erro: ${getErrorMessage(error)}`)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        isEditing,
        variations,
        existingImages,
        addVariation,
        removeVariation,
        handleVariationChange,
        handleRemoveExistingImage,
        handleMoveExistingImage,
        handleSetPrimaryImage,
        handleSubmit,
    }
}
