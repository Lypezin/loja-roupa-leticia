import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react"
import { notFound, permanentRedirect } from "next/navigation"
import { AddToCart } from "@/components/store/AddToCart"
import { ProductGallery } from "@/components/store/ProductGallery"
import { getProductPath, isUuidLike } from "@/lib/products"
import { getSiteUrl } from "@/lib/site-url"
import { createPublicClient } from "@/lib/supabase/public"

type ProductImage = {
    image_url: string
    is_primary?: boolean | null
    display_order?: number | null
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

type ProductMetadataRecord = {
    id: string
    slug: string
    name: string
    description: string | null
    product_images?: ProductImage[] | null
}

type ProductPageRecord = {
    id: string
    slug: string
    name: string
    description: string | null
    base_price: number
    category?: ProductCategory | ProductCategory[] | null
    variations?: ProductVariation[] | null
    images?: ProductImage[] | null
}

const PRODUCT_METADATA_SELECT = "id, slug, name, description, product_images(image_url, is_primary, display_order)"
const PRODUCT_PAGE_SELECT = `
    id,
    slug,
    name,
    description,
    base_price,
    category:categories(name, slug),
    variations:product_variations(id, size, color, stock_quantity),
    images:product_images(image_url, is_primary, display_order)
`

async function getProductMetadataByReference(productRef: string) {
    const supabase = createPublicClient()

    const { data: productBySlug } = await supabase
        .from("products")
        .select(PRODUCT_METADATA_SELECT)
        .eq("slug", productRef)
        .eq("is_active", true)
        .maybeSingle()

    if (productBySlug) {
        return productBySlug as ProductMetadataRecord
    }

    if (!isUuidLike(productRef)) {
        return null
    }

    const { data: productById } = await supabase
        .from("products")
        .select(PRODUCT_METADATA_SELECT)
        .eq("id", productRef)
        .eq("is_active", true)
        .maybeSingle()

    return (productById as ProductMetadataRecord | null) ?? null
}

async function getProductPageByReference(productRef: string) {
    const supabase = createPublicClient()

    const { data: productBySlug } = await supabase
        .from("products")
        .select(PRODUCT_PAGE_SELECT)
        .eq("slug", productRef)
        .eq("is_active", true)
        .maybeSingle()

    if (productBySlug) {
        return productBySlug as ProductPageRecord
    }

    if (!isUuidLike(productRef)) {
        return null
    }

    const { data: productById } = await supabase
        .from("products")
        .select(PRODUCT_PAGE_SELECT)
        .eq("id", productRef)
        .eq("is_active", true)
        .maybeSingle()

    return (productById as ProductPageRecord | null) ?? null
}

function getCanonicalProductUrl(slug: string) {
    return `${getSiteUrl()}${getProductPath(slug)}`
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id: productRef } = await params
    const product = await getProductMetadataByReference(productRef)

    if (!product) {
        notFound()
    }

    const resolvedProduct = product as ProductMetadataRecord
    const images = (resolvedProduct.product_images || []) as ProductImage[]
    const description = resolvedProduct.description || "Veja fotos, variações disponíveis e informações desta peça."
    const imageUrl = images.find((img) => img.is_primary)?.image_url || images[0]?.image_url
    const canonicalUrl = getCanonicalProductUrl(resolvedProduct.slug)

    return {
        title: resolvedProduct.name,
        description: description.slice(0, 160),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: resolvedProduct.name,
            description,
            url: canonicalUrl,
            images: imageUrl ? [{ url: imageUrl }] : [],
        },
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: productRef } = await params
    const product = await getProductPageByReference(productRef)

    if (!product) {
        notFound()
    }

    const resolvedProduct = product as ProductPageRecord

    if (productRef !== resolvedProduct.slug) {
        permanentRedirect(getProductPath(resolvedProduct.slug))
    }

    const images = (resolvedProduct.images || []) as ProductImage[]
    const rawCategory = resolvedProduct.category
    const category = Array.isArray(rawCategory) ? (rawCategory[0] || {}) : (rawCategory || {})
    const variations = (resolvedProduct.variations || []) as ProductVariation[]
    const primaryImage = images.find((img) => img.is_primary)?.image_url
        || images[0]?.image_url
        || "/placeholder-image.jpg"
    const categoryHref = category.slug ? `/${category.slug}` : "/produtos"

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(resolvedProduct.base_price)

    const installmentPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(resolvedProduct.base_price / 3)

    const highlights = [
        { icon: Truck, title: "Envio com rastreio", desc: "Prazo e valor aparecem antes do pagamento." },
        { icon: RefreshCcw, title: "Troca em até 7 dias", desc: "Suporte direto para orientar o pós-compra." },
        { icon: ShieldCheck, title: "Pagamento protegido", desc: "Checkout seguro do pedido ao recibo." },
    ]

    return (
        <div className="page-shell py-6 md:py-12">
            <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:mb-8 md:text-sm">
                <Link href="/" className="transition-colors hover:text-foreground">Início</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={categoryHref} className="transition-colors hover:text-foreground">
                    {category.name || "Catálogo"}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="min-w-0 max-w-full break-words text-foreground">{resolvedProduct.name}</span>
            </nav>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                <ProductGallery images={images} productName={resolvedProduct.name} />

                <div className="flex flex-col py-1 md:py-2">
                    <span className="eyebrow">{category.name || "produto"}</span>
                    <h1 className="mt-3 font-display text-[2.35rem] leading-tight text-foreground md:mt-4 md:text-5xl">
                        {resolvedProduct.name}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1.5 md:mt-5 md:gap-x-4 md:gap-y-2">
                        <p className="text-[1.9rem] font-semibold text-foreground md:text-3xl">{formattedPrice}</p>
                        <p className="pb-0.5 text-sm text-muted-foreground md:pb-1">ou 3x de {installmentPrice}</p>
                    </div>

                    <p className="mt-5 text-[0.98rem] leading-7 text-muted-foreground md:mt-6 md:text-base md:leading-8">
                        {resolvedProduct.description || "Confira fotos, escolha a variação ideal e adicione a peça na sacola com o frete calculado no carrinho."}
                    </p>

                    <AddToCart
                        productId={resolvedProduct.id}
                        productName={resolvedProduct.name}
                        price={resolvedProduct.base_price}
                        imageUrl={primaryImage}
                        variations={variations}
                    />

                    <div className="mt-6 grid gap-3 sm:grid-cols-3 md:mt-8">
                        {highlights.map((item, index) => (
                            <div
                                key={item.title}
                                className={`surface-card-soft hover-lift-soft animate-enter-soft rounded-[1.25rem] p-3.5 md:rounded-[1.4rem] md:p-4 ${
                                    index === 0 ? "" : index === 1 ? "animate-enter-delay-1" : "animate-enter-delay-2"
                                }`}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary md:h-10 md:w-10">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <h3 className="mt-3 text-sm font-semibold text-foreground md:mt-4">{item.title}</h3>
                                <p className="mt-1 text-sm leading-5.5 text-muted-foreground md:leading-6">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
