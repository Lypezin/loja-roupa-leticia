import { Search } from "lucide-react"
import { createPublicClient } from "@/lib/supabase/public"
import { ProductCard } from "@/components/store/ProductCard"
import { PaginationControls } from "@/components/store/PaginationControls"

const SEARCH_RESULTS_PER_PAGE = 12

type SearchProduct = {
    id: string
    name: string
    base_price: number
    category?: { name?: string | null } | null
    images?: { image_url: string; is_primary: boolean | null }[]
}

export const revalidate = 60

function buildSearchFilter(term: string, categoryIds: string[]) {
    if (categoryIds.length === 0) {
        return null
    }

    const safeTerm = term.replace(/[(),]/g, " ").trim()
    const encodedCategoryIds = categoryIds.join(",")

    return `name.ilike.%${safeTerm}%,category_id.in.(${encodedCategoryIds})`
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; page?: string }>
}) {
    const { q, page } = await searchParams
    const queryTerm = q?.trim() || ""
    const currentPage = Math.max(1, Number.parseInt(page || "1", 10) || 1)
    const from = (currentPage - 1) * SEARCH_RESULTS_PER_PAGE
    const to = from + SEARCH_RESULTS_PER_PAGE - 1
    const supabase = createPublicClient()

    if (!queryTerm) {
        return (
            <div className="page-shell py-20 text-center">
                <div className="mx-auto max-w-xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                        <Search className="h-7 w-7" />
                    </div>
                    <h1 className="mt-6 font-display text-4xl text-foreground">O que você quer encontrar?</h1>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Use a busca no topo para procurar por nome da peça, cor ou categoria.
                    </p>
                </div>
            </div>
        )
    }

    const { data: matchingCategories } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", `%${queryTerm}%`)

    const matchingCategoryIds = (matchingCategories || []).map((category) => category.id)
    const searchFilter = buildSearchFilter(queryTerm, matchingCategoryIds)

    const productQuery = supabase
        .from("products")
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(from, to)

    const countQuery = supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)

    const [{ data: products }, { count }] = await Promise.all([
        searchFilter
            ? productQuery.or(searchFilter)
            : productQuery.ilike("name", `%${queryTerm}%`),
        searchFilter
            ? countQuery.or(searchFilter)
            : countQuery.ilike("name", `%${queryTerm}%`),
    ])

    const results = (products || []) as SearchProduct[]
    const totalResults = count || 0
    const totalPages = Math.max(1, Math.ceil(totalResults / SEARCH_RESULTS_PER_PAGE))

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <span className="eyebrow">resultados</span>
                <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
                    Busca por {queryTerm}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    Encontramos {totalResults} produto(s).
                </p>
            </div>

            {results.length > 0 ? (
                <>
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {results.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    <PaginationControls
                        basePath="/search"
                        currentPage={currentPage}
                        totalPages={totalPages}
                        searchParams={{ q: queryTerm }}
                    />
                </>
            ) : (
                <div className="py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                        <Search className="h-7 w-7" />
                    </div>
                    <h2 className="mt-6 font-display text-3xl text-foreground">Nada apareceu nessa busca</h2>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Tente outro nome, cor ou categoria.
                    </p>
                </div>
            )}
        </div>
    )
}
