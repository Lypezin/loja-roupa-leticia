import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"
import { Search } from "lucide-react"

type SearchProduct = {
    id: string
    name: string
    base_price: number
    category?: { name: string }
    images?: { image_url: string; is_primary: boolean }[]
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const supabase = await createClient()

    if (!q) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold">O que você está procurando?</h1>
                <p className="text-zinc-500 mt-2">Digite algo na busca acima para encontrar produtos.</p>
            </div>
        )
    }

    const { data: products } = await supabase
        .from('products')
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .ilike('name', `%${q}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    const results = (products as unknown as SearchProduct[]) || []

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12">
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Resultados da busca</p>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Exibindo resultados para &quot;{q}&quot;</h1>
                <p className="text-zinc-500 mt-2">Encontramos {results.length} produto(s).</p>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {results.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h2 className="text-xl font-semibold">Nenhum produto encontrado</h2>
                    <p className="text-zinc-500 mt-2">Tente buscar por termos diferentes ou confira nossas categorias.</p>
                </div>
            )}
        </div>
    )
}
