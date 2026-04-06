import Link from "next/link"
import { ProductCardImage } from "./ProductCardImage"

type ProductImage = {
    image_url: string
    is_primary?: boolean | null
}

export type Product = {
    id: string
    name: string
    base_price: number
    category?: { name?: string | null } | null
    images?: ProductImage[]
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
    const images = product.images && product.images.length > 0
        ? [...product.images].sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)))
        : [{ image_url: "/placeholder-image.jpg", is_primary: true }]

    const formattedPrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.base_price)

    return (
        <article className="group surface-card flex h-full flex-col rounded-[1.85rem] p-3 transition-transform duration-300 hover:-translate-y-1">
            <Link href={`/produto/${product.id}`} className="flex h-full flex-col">
                <ProductCardImage
                    images={images}
                    productName={product.name}
                    isPriority={index < 4}
                />

                <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {product.category?.name || "produto"}
                    </p>
                    <h3 className="mt-3 font-display text-[1.7rem] leading-tight text-foreground">
                        {product.name}
                    </h3>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                        <p className="text-lg font-semibold text-foreground">{formattedPrice}</p>
                        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            ver peca
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    )
}
