import { Search } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"

type SearchProduct = {
    id: string
    name: string
    base_price: number
    category?: { name?: string | null } | null
    images?: { image_url: string; is_primary: boolean | null }[]
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
            <div className="page-shell py-20 text-center">
                <div className="mx-auto max-w-xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                        <Search className="h-7 w-7" />
                    </div>
                    <h1 className="mt-6 font-display text-4xl text-foreground">O que voce esta procurando?</h1>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Use a busca no topo para encontrar pecas por nome, linha ou categoria.
                    </p>
                </div>
            </div>
        )
    }

    const { data: products } = await supabase
        .from("products")
        .select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .ilike("name", `%${q}%`)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

    const results = (products || []) as SearchProduct[]

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <span className="eyebrow">resultados</span>
                <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
                    Busca por {q}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    Encontramos {results.length} produto(s).
                </p>
            </div>

            {results.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {results.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                        <Search className="h-7 w-7" />
                    </div>
                    <h2 className="mt-6 font-display text-3xl text-foreground">Nenhum resultado encontrado</h2>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Tente buscar por um termo diferente ou navegue pelas categorias.
                    </p>
                </div>
            )}
        </div>
    )
}
