import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"

export const revalidate = 60

export default async function AcessoriosPage() {
    const supabase = await createClient()

    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', 'acessório%')
        .single()

    let filteredProducts: any[] = []

    if (category) {
        const { data: products } = await supabase
            .from('products')
            .select(`
                id, name, base_price,
                category:categories(name),
                images:product_images(image_url, is_primary)
            `)
            .eq('is_active', true)
            .eq('category_id', category.id)
            .order('created_at', { ascending: false })

        filteredProducts = products || []
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Acessórios</h1>
                <p className="text-zinc-500 mt-2">Complementos essenciais para finalizar seu look.</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-zinc-500">
                    Nenhum acessório disponível no momento.
                </div>
            )}
        </div>
    )
}
