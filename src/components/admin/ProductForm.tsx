'use client'

import { ProductBasicInfo, type ShippingDefaults } from "./ProductBasicInfo"
import { ProductImageManager } from "./ProductImageManager"
import { VariationsEditor } from "./VariationsEditor"
import { Category, ProductData } from "@/types/product"
import { useProductForm } from "@/components/views/admin-produtos/useProductForm"
import { ProductHeader } from "@/components/views/admin-produtos/ProductHeader"
import { ProductStatusSection } from "@/components/views/admin-produtos/ProductStatusSection"
import { ProductSubmitSection } from "@/components/views/admin-produtos/ProductSubmitSection"

interface ProductFormProps {
    categories: Category[]
    product?: ProductData | null
    shippingDefaults?: ShippingDefaults | null
}

export function ProductForm({ categories, product, shippingDefaults }: ProductFormProps) {
    const {
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
    } = useProductForm(product)

    return (
        <form action={handleSubmit} className="flex w-full flex-col gap-6">
            <div className="space-y-6">
                <ProductHeader isEditing={isEditing} />

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
                        onAdd={addVariation}
                        onRemove={removeVariation}
                        onChange={handleVariationChange}
                    />

                    <ProductStatusSection isActive={product ? product.is_active : true} />

                    <ProductSubmitSection isLoading={isLoading} isEditing={isEditing} />
                </fieldset>
            </div>
        </form>
    )
}
