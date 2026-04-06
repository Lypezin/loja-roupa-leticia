'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { ColorSelector } from "./ColorSelector"
import { SizeSelector } from "./SizeSelector"
import { useVariationSelector, Variation } from "@/hooks/use-variation-selector"

type AddToCartProps = {
    productId: string
    productName: string
    price: number
    imageUrl: string
    variations: Variation[]
}

export function AddToCart({ productId, productName, price, imageUrl, variations }: AddToCartProps) {
    const addItem = useCartStore((state: any) => state.addItem)
    const [added, setAdded] = useState(false)

    const {
        selectedColor,
        handleColorChange,
        selectedSize,
        setSelectedSize,
        sizesForColor,
        availableColors,
        selectedVariation,
    } = useVariationSelector(variations)

    const handleAddToCart = () => {
        if (!selectedVariation || selectedVariation.stock_quantity <= 0) return

        addItem({
            id: selectedVariation.id,
            product_id: productId,
            product_name: productName,
            variation_id: selectedVariation.id,
            size: selectedSize || "",
            color: selectedColor || "",
            price,
            quantity: 1,
            image_url: imageUrl,
        })

        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
    }

    return (
        <div className="mt-8 rounded-[1.8rem] border border-border bg-card p-5 shadow-[0_14px_30px_rgba(68,48,31,0.05)]">
            <div className="space-y-6">
                <ColorSelector
                    availableColors={availableColors}
                    selectedColor={selectedColor}
                    variations={variations}
                    onSelect={handleColorChange}
                />

                <SizeSelector
                    sizesForColor={sizesForColor}
                    selectedSize={selectedSize}
                    variations={variations}
                    selectedColor={selectedColor}
                    onSelect={setSelectedSize}
                />

                <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariation || selectedVariation.stock_quantity <= 0}
                    size="lg"
                    className="h-12 w-full rounded-full text-sm font-semibold uppercase tracking-[0.16em]"
                >
                    {added ? "Na sacola" : !selectedVariation ? "Selecione as opcoes" : selectedVariation.stock_quantity <= 0 ? "Esgotado" : "Adicionar a sacola"}
                </Button>

                <p className="text-center text-xs leading-6 text-muted-foreground">
                    Frete gratis acima de R$ 300 e troca assistida em ate 7 dias.
                </p>
            </div>
        </div>
    )
}
