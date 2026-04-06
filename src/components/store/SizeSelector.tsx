'use client'

type Variation = {
    color: string | null
    size: string | null
    stock_quantity: number
}

interface SizeSelectorProps {
    sizesForColor: string[]
    selectedSize: string
    onSelect: (size: string) => void
    variations: Variation[]
    selectedColor: string
}

export function SizeSelector({ sizesForColor, selectedSize, onSelect, variations, selectedColor }: SizeSelectorProps) {
    if (sizesForColor.length === 0) return null

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Tamanho
            </h3>
            <div className="flex flex-wrap gap-3">
                {sizesForColor.map((size) => {
                    const matchingVariation = variations.find((variation) =>
                        (!selectedColor || variation.color === selectedColor) && variation.size === size
                    )
                    const isOutOfStock = matchingVariation ? matchingVariation.stock_quantity <= 0 : true

                    return (
                        <button
                            key={size}
                            disabled={isOutOfStock}
                            onClick={() => onSelect(size)}
                            className={`flex h-12 min-w-12 items-center justify-center rounded-[1rem] border px-4 text-sm font-medium transition-all ${
                                isOutOfStock
                                    ? "cursor-not-allowed border-border bg-muted opacity-40"
                                    : selectedSize === size
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-card text-foreground hover:bg-accent"
                            }`}
                        >
                            {size}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
