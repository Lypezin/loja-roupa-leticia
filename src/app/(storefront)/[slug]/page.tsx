import type { Metadata } from "next"
import { createPublicClient } from "@/lib/supabase/public"
import { FilterSort } from "@/components/store/FilterSort"
import { ProductCard, type Product } from "@/components/store/ProductCard"
import { PaginationControls } from "@/components/store/PaginationControls"
import { notFound } from "next/navigation"

export const revalidate = 60
const PRODUCTS_PER_PAGE = 12

async function getCategoryBySlug(slug: string) {
    const supabase = createPublicClient()
    const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", slug)
        .maybeSingle()

    return data
}

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await props.params
    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    return {
        title: category.name,
        description: `Pecas organizadas em ${category.name} para comparar foto, preco e disponibilidade com mais rapidez.`,
    }
}

export default async function CategoryPage(props: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort?: string; minPrice?: string; maxPrice?: string; page?: string }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const slug = params.slug
    const { sort, minPrice, maxPrice } = searchParams
    const currentPage = Math.max(1, Number.parseInt(searchParams.page || "1", 10) || 1)
    const from = (currentPage - 1) * PRODUCTS_PER_PAGE
    const to = from + PRODUCTS_PER_PAGE - 1
    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const supabase = createPublicClient()

    let query = supabase
        .from("products")
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .eq("is_active", true)
        .eq("category_id", category.id)

    let countQuery = supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .eq("category_id", category.id)

    if (minPrice) {
        query = query.gte("base_price", parseFloat(minPrice))
        countQuery = countQuery.gte("base_price", parseFloat(minPrice))
    }

    if (maxPrice) {
        query = query.lte("base_price", parseFloat(maxPrice))
        countQuery = countQuery.lte("base_price", parseFloat(maxPrice))
    }

    if (sort === "price-asc") {
        query = query.order("base_price", { ascending: true })
    } else if (sort === "price-desc") {
        query = query.order("base_price", { ascending: false })
    } else {
        query = query.order("created_at", { ascending: false })
    }

    const [{ data: products }, { count }] = await Promise.all([
        query.range(from, to),
        countQuery,
    ])

    const filteredProducts = (products ?? []) as Product[]
    const totalProducts = count || 0
    const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE))

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="paper-panel animate-enter-soft rounded-[2rem] px-6 py-6 md:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="eyebrow">categoria</span>
                        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{category.name}</h1>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                            Veja somente as pecas desta categoria, com preco, foto e disponibilidade em leitura direta.
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <FilterSort currentSort={sort} />
                    </div>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <>
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {filteredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    <PaginationControls
                        basePath={`/${slug}`}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        searchParams={{ sort, minPrice, maxPrice }}
                    />
                </>
            ) : (
                <div className="py-20 text-center text-muted-foreground">
                    Nenhum produto disponivel nesta categoria no momento.
                </div>
            )}
        </div>
    )
}
