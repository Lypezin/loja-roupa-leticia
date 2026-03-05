import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"
import { notFound } from "next/navigation"
import { FilterSort } from "@/components/store/FilterSort"

export const revalidate = 60

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: { slug: string }
    searchParams: { sort?: string; minPrice?: string; maxPrice?: string }
}) {
    const { slug } = params
    const { sort, minPrice, maxPrice } = searchParams
    const supabase = await createClient()

    // Buscar a categoria pelo slug
    const { data: category } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', slug)
        .single()

    if (!category) {
        notFound()
    }

    let query = supabase
        .from('products')
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .eq('is_active', true)
        .eq('category_id', category.id)

    if (minPrice) query = query.gte('base_price', parseFloat(minPrice))
    if (maxPrice) query = query.lte('base_price', parseFloat(maxPrice))

    if (sort === 'price-asc') query = query.order('base_price', { ascending: true })
    else if (sort === 'price-desc') query = query.order('base_price', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data: products } = await query

    const filteredProducts = products || []

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">{category.name}</h1>
                    <p className="text-muted-foreground mt-2">Encontre os melhores produtos em {category.name.toLowerCase()}.</p>
                </div>

                <div className="flex items-center gap-4">
                    <FilterSort currentSort={sort} />
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-muted-foreground">
                    Nenhum produto em {category.name} no momento.
                </div>
            )}
        </div>
    )
}
