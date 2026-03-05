import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"

export const revalidate = 60

export default async function CalcasPage() {
    const supabase = await createClient()

    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', 'calça%')
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
                <h1 className="text-4xl font-bold tracking-tight">Calças</h1>
                <p className="text-zinc-500 mt-2">Calças com caimento perfeito para todas as ocasiões.</p>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-zinc-500">
                    Nenhuma calça disponível no momento.
                </div>
            )}
        </div>
    )
}
