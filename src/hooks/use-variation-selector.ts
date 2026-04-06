import { useState } from "react"

export type Variation = {
  id: string
  size: string | null
  color: string | null
  stock_quantity: number
}

export function useVariationSelector(variations: Variation[]) {
  const availableColors = Array.from(new Set(variations.map((v) => v.color).filter(Boolean))) as string[]
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "")

  const sizesForColor = variations
    .filter((v) => !selectedColor || v.color === selectedColor)
    .map((v) => v.size)
    .filter(Boolean) as string[]

  const [selectedSize, setSelectedSize] = useState<string>(sizesForColor[0] || "")

  const selectedVariation = variations.find((v) => {
    const colorMatch = !availableColors.length || v.color === selectedColor
    const sizeMatch = !sizesForColor.length || v.size === selectedSize
    return colorMatch && sizeMatch
  })

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    const nextSizes = variations
      .filter((v) => v.color === color)
      .map((v) => v.size)
      .filter(Boolean) as string[]

    if (nextSizes.length > 0 && !nextSizes.includes(selectedSize)) {
      setSelectedSize(nextSizes[0])
    }
  }

  return {
    selectedColor,
    handleColorChange,
    selectedSize,
    setSelectedSize,
    sizesForColor,
    availableColors,
    selectedVariation,
  }
}
