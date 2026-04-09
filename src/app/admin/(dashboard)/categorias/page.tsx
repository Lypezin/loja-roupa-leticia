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

    const formattedCategories = (categories || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url,
        productsCount: cat.products[0]?.count || 0
    }))

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                <p className="text-muted-foreground">
                    Crie, edite e organize as categorias da sua loja.
                </p>
            </div>

            <CategoryManager initialCategories={formattedCategories} />
        </div>
    )
}
