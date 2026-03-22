'use client'

interface ColorSelectorProps {
    availableColors: string[];
    selectedColor: string;
    onSelect: (color: string) => void;
    variations: any[];
}

export function ColorSelector({ availableColors, selectedColor, onSelect, variations }: ColorSelectorProps) {
    if (availableColors.length === 0) return null

    return (
        <div className="space-y-3">
            <h3 className="font-medium text-sm text-zinc-900 uppercase tracking-widest">Cor / Tipo</h3>
            <div className="flex gap-3">
                {availableColors.map((color) => {
                    const matchingVariantColors = variations.find(v => v.color === color)
                    const isOutOfStock = matchingVariantColors ? matchingVariantColors.stock_quantity <= 0 : true
                    return (
                        <button
                            key={color}
                            disabled={isOutOfStock}
                            onClick={() => onSelect(color)}
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
    )
}
