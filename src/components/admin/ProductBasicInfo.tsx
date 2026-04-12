'use client'

import { useState } from "react"
import { ProductInfoSection } from "@/components/views/admin-produtos/ProductInfoSection"
import { ProductShippingSection } from "@/components/views/admin-produtos/ProductShippingSection"

type Category = {
    id: string
    name: string
}

export type ShippingDefaults = {
    sourceProductName: string
    weight_kg: number
    length_cm: number
    width_cm: number
    height_cm: number
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
    shippingDefaults?: ShippingDefaults | null
}

function formatFieldValue(value?: number | null) {
    return typeof value === "number" && Number.isFinite(value) ? String(value) : ""
}

function buildDefaultShippingState(product?: ProductBasicInfoProps["product"]) {
    return {
        weight_kg: formatFieldValue(product?.weight_kg),
        length_cm: formatFieldValue(product?.length_cm),
        width_cm: formatFieldValue(product?.width_cm),
        height_cm: formatFieldValue(product?.height_cm),
    }
}

export function ProductBasicInfo({ product, categories, shippingDefaults }: ProductBasicInfoProps) {
    const [shippingFields, setShippingFields] = useState(buildDefaultShippingState(product))

    const hasCompleteShippingFields = Object.values(shippingFields).every(Boolean)

    const applyShippingDefaults = () => {
        if (!shippingDefaults) return
        setShippingFields({
            weight_kg: String(shippingDefaults.weight_kg),
            length_cm: String(shippingDefaults.length_cm),
            width_cm: String(shippingDefaults.width_cm),
            height_cm: String(shippingDefaults.height_cm),
        })
    }

    const clearShippingFields = () => {
        setShippingFields({ weight_kg: "", length_cm: "", width_cm: "", height_cm: "" })
    }

    return (
        <div className="space-y-6">
            <ProductInfoSection product={product} categories={categories} />
            <ProductShippingSection
                shippingFields={shippingFields}
                setShippingFields={setShippingFields}
                shippingDefaults={shippingDefaults}
                hasCompleteShippingFields={hasCompleteShippingFields}
                onApplyDefaults={applyShippingDefaults}
                onClearFields={clearShippingFields}
            />
        </div>
    )
}
