import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react"
import { notFound } from "next/navigation"
import { AddToCart } from "@/components/store/AddToCart"
import { ProductGallery } from "@/components/store/ProductGallery"
import { createPublicClient } from "@/lib/supabase/public"

type ProductImage = {
    image_url: string
    is_primary?: boolean | null
}

type ProductCategory = {
    name?: string | null
    slug?: string | null
}

type ProductVariation = {
    id: string
    size: string | null
    color: string | null
    stock_quantity: number
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const supabase = createPublicClient()

    const { data: product } = await supabase
        .from("products")
        .select("name, description, product_images(image_url, is_primary)")
        .eq("id", id)
        .maybeSingle()

    if (!product) {
        notFound()
    }

    const images = (product.product_images || []) as ProductImage[]
    const description = product.description || "Veja fotos, variacoes disponiveis e informacoes desta peca."
    const imageUrl = images.find((img) => img.is_primary)?.image_url || images[0]?.image_url

    return {
        title: product.name,
        description: description.slice(0, 160),
        openGraph: {
            title: product.name,
            description,
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
    const supabase = createPublicClient()

    const { data: product } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(name, slug),
            variations:product_variations(*),
            images:product_images(image_url, is_primary)
        `)
        .eq("id", id)
        .maybeSingle()

    if (!product) {
        notFound()
    }

    const images = (product.images || []) as ProductImage[]
    const category = (product.category || {}) as ProductCategory
    const variations = (product.variations || []) as ProductVariation[]
    const primaryImage = images.find((img) => img.is_primary)?.image_url
        || images[0]?.image_url
        || "/placeholder-image.jpg"
    const categoryHref = category.slug ? `/${category.slug}` : "/produtos"

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(product.base_price)

    const installmentPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(product.base_price / 3)

    const highlights = [
        { icon: Truck, title: "Envio com rastreio", desc: "Prazo e valor aparecem antes do pagamento." },
        { icon: RefreshCcw, title: "Troca em ate 7 dias", desc: "Suporte direto para orientar o pos-compra." },
        { icon: ShieldCheck, title: "Pagamento protegido", desc: "Checkout seguro do pedido ao recibo." },
    ]

    return (
        <div className="page-shell py-8 md:py-12">
            <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">Inicio</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={categoryHref} className="transition-colors hover:text-foreground">
                    {category.name || "Catalogo"}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="min-w-0 max-w-full break-words text-foreground">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                <ProductGallery images={images} productName={product.name} />

                <div className="flex flex-col py-2">
                    <span className="eyebrow">{category.name || "produto"}</span>
                    <h1 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">
                        {product.name}
                    </h1>

                    <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
                        <p className="text-3xl font-semibold text-foreground">
                            {formattedPrice}
                        </p>
                        <p className="pb-1 text-sm text-muted-foreground">
                            ou 3x de {installmentPrice}
                        </p>
                    </div>

                    <p className="mt-6 text-base leading-8 text-muted-foreground">
                        {product.description || "Confira fotos, escolha a variacao ideal e adicione a peca na sacola com o frete calculado no carrinho."}
                    </p>

                    <AddToCart
                        productId={product.id}
                        productName={product.name}
                        price={product.base_price}
                        imageUrl={primaryImage}
                        variations={variations}
                    />

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {highlights.map((item, index) => (
                            <div key={item.title} className={`surface-card-soft hover-lift-soft animate-enter-soft rounded-[1.4rem] p-4 ${index === 0 ? "" : index === 1 ? "animate-enter-delay-1" : "animate-enter-delay-2"}`}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-foreground">{item.title}</h3>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
