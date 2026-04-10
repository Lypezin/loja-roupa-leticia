import { createClient } from "@/lib/supabase/server"
import { CategoryManager } from "./components/CategoryManager"

export const metadata = {
    title: "Categorias | Admin",
}

export default async function CategoriasPage() {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
        .from('categories')
        .select(`
            id,
            name,
            slug,
            image_url,
            created_at,
            products(count)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
    }

    const formattedCategories = (categories || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url,
        productsCount: cat.products[0]?.count || 0
    }))

    return (
        <div className="flex flex-col gap-6">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <span className="eyebrow">organização da vitrine</span>
                <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Categorias</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    Crie, edite e organize as coleções da loja. Hoje a navegação conta com {formattedCategories.length} categoria(s) cadastrada(s).
                </p>
            </div>

            <CategoryManager initialCategories={formattedCategories} />
        </div>
    )
}
