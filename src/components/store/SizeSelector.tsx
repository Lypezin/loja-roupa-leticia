'use client'

interface SizeSelectorProps {
    sizesForColor: string[];
    selectedSize: string;
    onSelect: (size: string) => void;
    variations: any[];
    selectedColor: string;
}

export function SizeSelector({ sizesForColor, selectedSize, onSelect, variations, selectedColor }: SizeSelectorProps) {
    if (sizesForColor.length === 0) return null

    return (
        <div className="space-y-3">
            <h3 className="font-medium text-sm text-zinc-900 uppercase tracking-widest mt-2">
                Tamanho / Vol
            </h3>
            <div className="flex gap-3">
                {sizesForColor.map((size) => {
                    const matchingVariantSizes = variations.find(v =>
                        (!selectedColor || v.color === selectedColor) && v.size === size
                    )
                    const isSizeOutOfStock = matchingVariantSizes ? matchingVariantSizes.stock_quantity <= 0 : true

                    return (
                        <button
                            key={size}
                            disabled={isSizeOutOfStock}
                            onClick={() => onSelect(size)}
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
    )
}
