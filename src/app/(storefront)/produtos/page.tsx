import { createPublicClient } from "@/lib/supabase/public"
import { ProductCard } from "@/components/store/ProductCard"
import { FilterSort } from "@/components/store/FilterSort"
import { PaginationControls } from "@/components/store/PaginationControls"

export const revalidate = 60
const PRODUCTS_PER_PAGE = 12

type CatalogProduct = {
    id: string
    name: string
    base_price: number
    category?: { name?: string | null } | null
    images?: { image_url: string; is_primary: boolean | null }[]
}

export default async function ProdutosPage({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string; minPrice?: string; maxPrice?: string; page?: string }>
}) {
    const params = await searchParams
    const { sort, minPrice, maxPrice } = params
    const currentPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1)
    const from = (currentPage - 1) * PRODUCTS_PER_PAGE
    const to = from + PRODUCTS_PER_PAGE - 1
    const supabase = createPublicClient()

    let query = supabase
        .from("products")
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .eq("is_active", true)

    let countQuery = supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)

    if (minPrice) {
        query = query.gte("base_price", parseFloat(minPrice))
        countQuery = countQuery.gte("base_price", parseFloat(minPrice))
    }

    if (maxPrice) {
        query = query.lte("base_price", parseFloat(maxPrice))
        countQuery = countQuery.lte("base_price", parseFloat(maxPrice))
    }

    if (sort === "price-asc") query = query.order("base_price", { ascending: true })
    else if (sort === "price-desc") query = query.order("base_price", { ascending: false })
    else query = query.order("created_at", { ascending: false })

    const [{ data: products }, { count }] = await Promise.all([
        query.range(from, to),
        countQuery,
    ])

    const totalProducts = count || 0
    const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE))

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="eyebrow">catálogo</span>
                        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Todas as peças</h1>
                        <p className="mt-3 text-sm text-muted-foreground">
                            {totalProducts} produto(s) encontrado(s).
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <FilterSort currentSort={sort} />
                    </div>
                </div>
            </div>

            {products && products.length > 0 ? (
                <>
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {(products as CatalogProduct[]).map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    <PaginationControls
                        basePath="/produtos"
                        currentPage={currentPage}
                        totalPages={totalPages}
                        searchParams={{ sort, minPrice, maxPrice }}
                    />
                </>
            ) : (
                <div className="py-20 text-center text-muted-foreground">
                    Nenhum produto disponível no momento.
                </div>
            )}
        </div>
    )
}
