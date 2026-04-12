'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Image as ImageIcon, Loader2, Package2, Shapes, Truck } from "lucide-react"
import { toast } from "sonner"
import { saveProduct } from "@/app/admin/(dashboard)/produtos/actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { uploadProductImages } from "@/lib/utils/product-upload"
import { ProductBasicInfo, type ShippingDefaults } from "./ProductBasicInfo"
import { ProductImageManager } from "./ProductImageManager"
import { VariationsEditor } from "./VariationsEditor"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return "Falha ao salvar produto."
}

type Category = { id: string; name: string }
type Variation = { size: string; color: string; stock_quantity: number }
type ExistingImage = { id?: string; image_url: string; is_primary: boolean; display_order?: number | null }
type ProductData = {
    id: string
    name: string
    description?: string
    base_price: number
    weight_kg?: number | null
    height_cm?: number | null
    width_cm?: number | null
    length_cm?: number | null
    category_id: string
    is_active: boolean
    variations?: Variation[]
    images?: ExistingImage[]
}

interface ProductFormProps {
    categories: Category[]
    product?: ProductData | null
    shippingDefaults?: ShippingDefaults | null
}

function sanitizeVariation(variation: Variation) {
    return {
        size: variation.size.trim(),
        color: variation.color.trim(),
        stock_quantity: Number.isFinite(variation.stock_quantity) ? Math.max(0, variation.stock_quantity) : 0,
    }
}

function normalizeExistingImages(images: ExistingImage[]) {
    if (images.length === 0) {
        return []
    }

    const orderedImages = [...images].sort((a, b) => {
        const displayOrderA = typeof a.display_order === "number" ? a.display_order : Number.MAX_SAFE_INTEGER
        const displayOrderB = typeof b.display_order === "number" ? b.display_order : Number.MAX_SAFE_INTEGER
        if (displayOrderA !== displayOrderB) {
            return displayOrderA - displayOrderB
        }

        return Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))
    })

    const primaryIndex = orderedImages.findIndex((image) => image.is_primary)
    const normalizedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0

    return orderedImages.map((image, index) => ({
        ...image,
        is_primary: index === normalizedPrimaryIndex,
        display_order: index,
    }))
}

export function ProductForm({ categories, product, shippingDefaults }: ProductFormProps) {
    const router = useRouter()
    const isEditing = !!product
    const [isLoading, setIsLoading] = useState(false)
    const [variations, setVariations] = useState<Variation[]>(product?.variations || [{ size: "", color: "", stock_quantity: 0 }])
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(normalizeExistingImages(product?.images || []))

    const handleVariationChange = (index: number, field: keyof Variation, value: string | number) => {
        const newVariations = [...variations]
        newVariations[index] = { ...newVariations[index], [field]: value }
        setVariations(newVariations)
    }

    const updateExistingImages = (updater: (images: ExistingImage[]) => ExistingImage[]) => {
        setExistingImages((currentImages) => normalizeExistingImages(updater(currentImages)))
    }

    const handleRemoveExistingImage = (index: number) => {
        updateExistingImages((currentImages) => currentImages.filter((_, currentIndex) => currentIndex !== index))
    }

    const handleMoveExistingImage = (index: number, direction: "left" | "right") => {
        updateExistingImages((currentImages) => {
            const nextIndex = direction === "left" ? index - 1 : index + 1

            if (nextIndex < 0 || nextIndex >= currentImages.length) {
                return currentImages
            }

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
            if (isEditing) {
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

    const effectiveVariationCount = variations.filter((variation) => variation.size.trim() || variation.color.trim()).length

    return (
        <form action={handleSubmit} className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="space-y-6">
                <div className="rounded-[1.8rem] border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                {isEditing ? "Edição" : "Cadastro"}
                            </p>
                            <h2 className="text-xl font-semibold text-zinc-950">
                                {isEditing ? "Atualize o produto com mais controle" : "Monte o produto em etapas simples"}
                            </h2>
                            <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                                Primeiro defina os dados principais e o pacote de frete. Depois organize imagens, variações e visibilidade.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/admin/produtos">Voltar para produtos</Link>
                        </Button>
                    </div>
                </div>

                <fieldset disabled={isLoading} className="space-y-6 disabled:opacity-95">
                    <ProductBasicInfo
                        product={product || undefined}
                        categories={categories}
                        shippingDefaults={shippingDefaults}
                    />

                    <ProductImageManager
                        existingImages={existingImages}
                        onRemoveExisting={handleRemoveExistingImage}
                        onMoveExisting={handleMoveExistingImage}
                        onSetPrimary={handleSetPrimaryImage}
                    />

                    <VariationsEditor
                        variations={variations}
                        onAdd={() => setVariations([...variations, { size: "", color: "", stock_quantity: 0 }])}
                        onRemove={(idx) => setVariations(variations.filter((_, i) => i !== idx))}
                        onChange={handleVariationChange}
                    />

                    <section className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700">
                                <CheckCircle2 className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Publicação</p>
                                <h3 className="mt-2 text-lg font-semibold text-zinc-950">Status do produto</h3>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                defaultChecked={product ? product.is_active : true}
                                value="true"
                                className="h-4 w-4 cursor-pointer rounded border-gray-300"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer text-sm leading-6">
                                Deixar este produto ativo e visível na loja assim que for salvo.
                            </Label>
                        </div>
                    </section>

                    <div className="rounded-[1.8rem] border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm md:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Finalização</p>
                                <p className="mt-2 text-sm leading-6 text-white/80">
                                    O cadastro só é salvo quando imagens, variações e medidas estiverem consistentes.
                                </p>
                            </div>
                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="h-12 w-full rounded-full bg-white px-6 text-base text-zinc-950 hover:bg-white/90 lg:w-auto"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Salvando produto...
                                    </>
                                ) : (
                                    isEditing ? "Atualizar produto" : "Criar produto"
                                )}
                            </Button>
                        </div>
                    </div>
                </fieldset>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
                <div className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Checklist</p>
                    <div className="mt-4 space-y-3 text-sm text-zinc-600">
                        <div className="flex items-start gap-3">
                            <Package2 className="mt-0.5 h-4 w-4 text-zinc-400" />
                            <span>Categoria e preço base definidos.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Truck className="mt-0.5 h-4 w-4 text-zinc-400" />
                            <span>Peso e dimensões do pacote preenchidos para o frete.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <ImageIcon className="mt-0.5 h-4 w-4 text-zinc-400" />
                            <span>
                                {existingImages.length > 0
                                    ? `${existingImages.length} imagem(ns) atual(is), com capa e ordem configuráveis.`
                                    : "Envie pelo menos uma imagem para a vitrine."}
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Shapes className="mt-0.5 h-4 w-4 text-zinc-400" />
                            <span>{effectiveVariationCount} variação(ões) pronta(s) para venda.</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50/80 p-5">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-700" />
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Ponto de atenção</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-amber-900">
                        As medidas precisam representar o produto já embalado. Se o pacote mudar, a cotação do frete muda junto.
                    </p>
                </div>
            </aside>
        </form>
    )
}
