import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AddToCart } from "@/components/store/AddToCart"
import { ProductGallery } from "@/components/store/ProductGallery"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Metadata } from 'next'

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('name, description, product_images(image_url)')
        .eq('id', id)
        .single()

    if (!product) return {}

    const description = product.description || "Confira este produto incrível em nossa loja."
    const imageUrl = product.product_images?.find((img: any) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url

    return {
        title: product.name,
        description: description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: description,
            images: imageUrl ? [{ url: imageUrl }] : [],
        },
    }
}

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

    const installmentPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.base_price / 3)

    return (
        <div className="container mx-auto px-4 py-6 md:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href={`/${product.category?.name?.toLowerCase() || 'camisetas'}`} className="hover:text-foreground transition-colors">
                    {product.category?.name || 'Camisetas'}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

                {/* Galeria de Fotos Interativa */}
                <ProductGallery images={product.images || []} />

                {/* Informações e Adição ao Carrinho */}
                <div className="flex flex-col py-2 md:py-6">
                    <div className="space-y-3 mb-6">
                        <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                            {product.category?.name || 'Sem categoria'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl text-foreground font-bold">
                                {formattedPrice}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                até 3x de {installmentPrice}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description || "Peça exclusiva com design minimalista, construída com materiais premium visando o máximo de conforto diário."}
                        </p>
                    </div>

                    <div className="w-full border-t border-border mb-2" />

                    {/* O componente Client-side gerencia Zustand e cliques */}
                    <AddToCart
                        productId={product.id}
                        productName={product.name}
                        price={product.base_price}
                        imageUrl={primaryImage}
                        variations={product.variations || []}
                    />

                    {/* Trust Indicators */}
                    <div className="mt-8 pt-6 border-t border-border space-y-3">
                        {[
                            { icon: "🚀", text: "Envio para todo o Brasil" },
                            { icon: "↩️", text: "Troca grátis em até 7 dias" },
                            { icon: "🔒", text: "Compra 100% segura" },
                        ].map(item => (
                            <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
