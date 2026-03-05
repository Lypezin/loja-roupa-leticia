import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AddToCart } from "@/components/store/AddToCart"

export default async function ProductPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(name),
      variations:product_variations(*),
      images:product_images(image_url, is_primary)
    `)
        .eq('id', id)
        .single()

    if (!product) {
        notFound()
    }

    const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url
        || product.images?.[0]?.image_url
        || "/placeholder-image.jpg"

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.base_price)

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

                {/* Galeria de Fotos */}
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-[3/4] w-full bg-zinc-100 rounded-2xl overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${primaryImage})` }}
                        />
                    </div>
                    {/* Thumbnails entrariam aqui se houvesse mais fotos */}
                </div>

                {/* Informações e Adição ao Carrinho */}
                <div className="flex flex-col py-4 md:py-10">
                    <div className="space-y-2 mb-6">
                        <h2 className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
                            {/* @ts-ignore */}
                            {product.category?.name || 'Sem categoria'}
                        </h2>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
                            {product.name}
                        </h1>
                        <p className="text-2xl text-zinc-900 font-medium pt-2">
                            {formattedPrice}
                        </p>
                    </div>

                    <div className="prose prose-zinc mb-8">
                        <p className="text-zinc-600 leading-relaxed text-lg">
                            {product.description || "Esta peça é uma obra de design minimalista construída com materiais premium visando o máximo de conforto diário."}
                        </p>
                    </div>

                    <div className="w-full border-t border-zinc-200" />

                    {/* O componente Client-side gerencia Zustand e cliques */}
                    <AddToCart
                        productId={product.id}
                        productName={product.name}
                        price={product.base_price}
                        imageUrl={primaryImage}
                        variations={product.variations || []}
                    />

                </div>
            </div>
        </div>
    )
}
