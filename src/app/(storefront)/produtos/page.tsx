import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"
import { FilterSort } from "@/components/store/FilterSort"

export const revalidate = 60

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
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                        Catálogo
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Todos os Produtos</h1>
                    <p className="text-muted-foreground mt-2">
                        {products?.length || 0} produto(s) encontrado(s).
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <FilterSort currentSort={sort} />
                </div>
            </div>

            {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((product: any, i: number) => (
                        <ProductCard key={product.id} product={product} index={i} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-muted-foreground">
                    Nenhum produto disponível no momento.
                </div>
            )}
        </div>
    )
}
