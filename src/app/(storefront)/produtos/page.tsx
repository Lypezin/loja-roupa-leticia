import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"
import { FilterSort } from "@/components/store/FilterSort"

export const revalidate = 60

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
    searchParams: Promise<{ sort?: string; minPrice?: string; maxPrice?: string }>
}) {
    const params = await searchParams
    const { sort, minPrice, maxPrice } = params
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .eq('is_active', true)

    if (minPrice) query = query.gte('base_price', parseFloat(minPrice))
    if (maxPrice) query = query.lte('base_price', parseFloat(maxPrice))

    if (sort === 'price-asc') query = query.order('base_price', { ascending: true })
    else if (sort === 'price-desc') query = query.order('base_price', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data: products } = await query

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="eyebrow">catalogo</span>
                        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Todas as pecas</h1>
                        <p className="mt-3 text-sm text-muted-foreground">
                            {products?.length || 0} produto(s) encontrado(s).
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <FilterSort currentSort={sort} />
                    </div>
                </div>
            </div>

            {products && products.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {(products as CatalogProduct[]).map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-muted-foreground">
                    Nenhum produto disponivel no momento.
                </div>
            )}
        </div>
    )
}
