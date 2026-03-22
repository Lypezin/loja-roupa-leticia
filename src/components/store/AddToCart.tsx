'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"

type Variation = {
    id: string
    size: string
    color: string
    stock_quantity: number
}

type AddToCartProps = {
    productId: string
    productName: string
    price: number
    imageUrl: string
    variations: Variation[]
}

import { ColorSelector } from "./ColorSelector"
import { SizeSelector } from "./SizeSelector"

export function AddToCart({ productId, productName, price, imageUrl, variations }: AddToCartProps) {
    const addItem = useCartStore((state) => state.addItem)
    const availableColors = Array.from(new Set(variations.map(v => v.color).filter(Boolean)))
    const availableSizes = Array.from(new Set(variations.map(v => v.size).filter(Boolean)))

    const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "")
    const sizesForColor = variations.filter(v => !selectedColor || v.color === selectedColor).map(v => v.size).filter(Boolean)
    const [selectedSize, setSelectedSize] = useState<string>(sizesForColor[0] || "")
    const [added, setAdded] = useState(false)

    const selectedVariation = variations.find(v => {
        const colorMatch = !availableColors.length || v.color === selectedColor
        const sizeMatch = !availableSizes.length || v.size === selectedSize
        return colorMatch && sizeMatch
    })

    const handleAddToCart = () => {
        if (!selectedVariation || selectedVariation.stock_quantity <= 0) return
        addItem({ id: selectedVariation.id, product_id: productId, product_name: productName, variation_id: selectedVariation.id, size: selectedSize || "", color: selectedColor || "", price, quantity: 1, image_url: imageUrl })
        setAdded(true); setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="flex flex-col gap-6 mt-8">
            <ColorSelector availableColors={availableColors} selectedColor={selectedColor} variations={variations} onSelect={(color) => {
                setSelectedColor(color)
                const s = variations.filter(v => v.color === color).map(v => v.size).filter(Boolean)
                if (s.length > 0 && !s.includes(selectedSize)) setSelectedSize(s[0])
            }} />

            <SizeSelector sizesForColor={sizesForColor} selectedSize={selectedSize} variations={variations} selectedColor={selectedColor} onSelect={setSelectedSize} />

            <Button onClick={handleAddToCart} disabled={!selectedVariation || selectedVariation.stock_quantity <= 0} size="lg" className="w-full h-14 text-base tracking-wide bg-zinc-950 hover:bg-zinc-800 text-white cursor-pointer mt-4 transition-all">
                {added ? "Adicionado ✓" : !selectedVariation ? "Selecione as opções" : selectedVariation.stock_quantity <= 0 ? "Esgotado" : "Adicionar à Sacola"}
            </Button>
            <p className="text-xs text-center text-zinc-500 mt-2">Frete grátis para todo o Brasil acima de R$ 300.</p>
        </div>
    )
}
