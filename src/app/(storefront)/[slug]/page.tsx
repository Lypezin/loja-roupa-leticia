import { createClient } from "@/lib/supabase/server"
import { FilterSort } from "@/components/store/FilterSort"
import { ProductCard, type Product } from "@/components/store/ProductCard"
import { notFound } from "next/navigation"

export const revalidate = 60

export default async function CategoryPage(props: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort?: string; minPrice?: string; maxPrice?: string }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const slug = params.slug
    const { sort, minPrice, maxPrice } = searchParams
    const supabase = await createClient()

    const { data: category } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", slug)
        .single()

    if (!category) {
        notFound()
    }

    let query = supabase
        .from("products")
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .eq("is_active", true)
        .eq("category_id", category.id)

    if (minPrice) query = query.gte("base_price", parseFloat(minPrice))
    if (maxPrice) query = query.lte("base_price", parseFloat(maxPrice))

    if (sort === "price-asc") query = query.order("base_price", { ascending: true })
    else if (sort === "price-desc") query = query.order("base_price", { ascending: false })
    else query = query.order("created_at", { ascending: false })

    const { data: products } = await query
    const filteredProducts = (products ?? []) as Product[]

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="eyebrow">categoria</span>
                        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{category.name}</h1>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                            Modelos organizados por tipo de peca para ficar mais rapido comparar imagem, preco e disponibilidade.
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <FilterSort currentSort={sort} />
                    </div>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-muted-foreground">
                    Nenhum produto disponivel nesta categoria no momento.
                </div>
            )}
        </div>
    )
}
