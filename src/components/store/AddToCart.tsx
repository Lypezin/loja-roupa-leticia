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

export function AddToCart({ productId, productName, price, imageUrl, variations }: AddToCartProps) {
    const addItem = useCartStore((state) => state.addItem)

    // Agrupar tamanhos e cores únicos
    const availableColors = Array.from(new Set(variations.map(v => v.color)))

    const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "")
    // Filtramos os tamanhos disponíveis apenas para a cor selecionada atualmente
    const sizesForColor = variations.filter(v => v.color === selectedColor).map(v => v.size)
    const [selectedSize, setSelectedSize] = useState<string>(sizesForColor[0] || "")

    const [added, setAdded] = useState(false)

    // Encontrar a variação exata selecionada no banco para descontar do estoque dps
    const selectedVariation = variations.find(
        v => v.color === selectedColor && v.size === selectedSize
    )

    const handleAddToCart = () => {
        if (!selectedVariation) return

        if (selectedVariation.stock_quantity <= 0) {
            alert("Produto sem estoque nesta variação")
            return
        }

        addItem({
            id: selectedVariation.id, // O ID no carrinho será o ID da Variação única pra não misturar P com M
            product_id: productId,
            product_name: productName,
            variation_id: selectedVariation.id,
            size: selectedSize,
            color: selectedColor,
            price: price,
            quantity: 1,
            image_url: imageUrl
        })

        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="flex flex-col gap-6 mt-8">

            {/* Seletor de Cores */}
            {availableColors.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-medium text-sm text-zinc-900 uppercase tracking-widest">Cor</h3>
                    <div className="flex gap-3">
                        {availableColors.map((color) => {
                            // Pegamos a variação específica global 
                            const matchingVariantColors = variations.find(v => v.color === color)
                            const isOutOfStock = matchingVariantColors ? matchingVariantColors.stock_quantity <= 0 : true
                            return (
                                <button
                                    key={color}
                                    disabled={isOutOfStock}
                                    onClick={() => {
                                        setSelectedColor(color)
                                        // Ao trocar de cor, reseta o tamanho se ele não tiver pra nova cor
                                        const newSizes = variations.filter(v => v.color === color).map(v => v.size)
                                        if (!newSizes.includes(selectedSize)) {
                                            setSelectedSize(newSizes[0])
                                        }
                                    }}
                                    className={`px-5 py-2.5 text-sm font-medium border rounded-full transition-all ${isOutOfStock ? "opacity-30 cursor-not-allowed line-through" :
                                        selectedColor === color
                                            ? "border-zinc-900 bg-zinc-900 text-white shadow-md transform scale-105 inline-block"
                                            : "border-zinc-200 hover:border-zinc-400 text-zinc-700 bg-zinc-50"
                                        }`}
                                >
                                    {color}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Seletor de Tamanhos */}
            {sizesForColor.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-medium text-sm text-zinc-900 uppercase tracking-widest mt-2">
                        Tamanho
                    </h3>
                    <div className="flex gap-3">
                        {sizesForColor.map((size) => {
                            const matchingVariantSizes = variations.find(v => v.color === selectedColor && v.size === size)
                            const isSizeOutOfStock = matchingVariantSizes ? matchingVariantSizes.stock_quantity <= 0 : true

                            return (
                                <button
                                    key={size}
                                    disabled={isSizeOutOfStock}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 flex items-center justify-center font-medium text-sm border transition-all rounded-xl ${isSizeOutOfStock ? "opacity-30 cursor-not-allowed text-zinc-400 bg-zinc-100" :
                                        selectedSize === size
                                            ? "border-zinc-900 bg-zinc-900 text-white shadow-md transform scale-105"
                                            : "border-zinc-200 hover:border-zinc-400 text-zinc-700 bg-zinc-50"
                                        }`}
                                >
                                    {size}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Botão Principal */}
            <Button
                onClick={handleAddToCart}
                disabled={!selectedVariation || selectedVariation.stock_quantity <= 0}
                size="lg"
                className="w-full h-14 text-base tracking-wide bg-zinc-950 hover:bg-zinc-800 text-white cursor-pointer mt-4 transition-all"
            >
                {added ? "Adicionado ao carrinho ✓" :
                    !selectedVariation ? "Selecione as opções" :
                        selectedVariation.stock_quantity <= 0 ? "Esgotado nesta variação" :
                            "Adicionar à Sacola"
                }
            </Button>

            {/* Micro copy */}
            <p className="text-xs text-center text-zinc-500 mt-2">
                Frete grátis para todo o Brasil acima de R$ 300.
            </p>
        </div>
    )
}
