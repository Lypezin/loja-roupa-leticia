'use client'

type Variation = {
    color: string | null
    stock_quantity: number
}

interface ColorSelectorProps {
    availableColors: string[]
    selectedColor: string
    onSelect: (color: string) => void
    variations: Variation[]
}

export function ColorSelector({ availableColors, selectedColor, onSelect, variations }: ColorSelectorProps) {
    if (availableColors.length === 0) return null

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Cor / tipo</h3>
            <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => {
                    const matchingVariation = variations.find((variation) => variation.color === color)
                    const isOutOfStock = matchingVariation ? matchingVariation.stock_quantity <= 0 : true

                    return (
                        <button
                            key={color}
                            disabled={isOutOfStock}
                            onClick={() => onSelect(color)}
                            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                                isOutOfStock
                                    ? "cursor-not-allowed border-border opacity-35 line-through"
                                    : selectedColor === color
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-card text-foreground hover:bg-accent"
                            }`}
                        >
                            {color}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
