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
            <div className="flex flex-wrap gap-2.5 md:gap-3">
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
                            className={`interactive-press flex h-11 min-w-11 items-center justify-center rounded-[0.95rem] border px-3.5 text-sm font-medium transition-all md:h-12 md:min-w-12 md:rounded-[1rem] md:px-4 ${
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
