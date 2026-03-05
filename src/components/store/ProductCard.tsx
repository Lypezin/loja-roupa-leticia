import Link from "next/link"
import Image from "next/image"

export type Product = {
    id: string
    name: string
    base_price: number
    category?: { name: string }
    images?: { image_url: string, is_primary: boolean }[]
}

export function ProductCard({ product }: { product: Product }) {
    const primaryImage = product.images?.find(img => img.is_primary)?.image_url
        || product.images?.[0]?.image_url
        || "/placeholder-image.jpg" // Imagem fallback que usaremos pra mockup

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.base_price)

    return (
        <Link href={`/produto/${product.id}`} className="group relative flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-xl">
                {/* Usando div bg image como fallback rápido para o protótipo, mas otimizaremos p/ next/image depois do bucket */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${primaryImage})` }}
                />
                {/* Badge se tiver promoção/novidade pode entrar aqui */}
            </div>

            <div className="flex flex-col gap-1 px-1">
                <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium">
                    {product.category?.name || "Sem Categoria"}
                </p>
                <h3 className="text-zinc-900 font-medium leading-tight">
                    {product.name}
                </h3>
                <p className="text-zinc-900 font-semibold mt-1">
                    {formattedPrice}
                </p>
            </div>
        </Link>
    )
}
