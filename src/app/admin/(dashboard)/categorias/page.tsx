import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { createClient } from "@/lib/supabase/server"
import { CategoryManager } from "./components/CategoryManager"

export const metadata = {
    title: "Categorias | Admin",
}

export default async function CategoriasPage() {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
        .from("categories")
        .select(`
            id,
            name,
            slug,
            image_url,
            created_at,
            products(count)
        `)
        .order("created_at", { ascending: false })

    if (error) {
        console.error(error)
    }

    const formattedCategories = (categories || []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url,
        productsCount: cat.products[0]?.count || 0,
    }))

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                eyebrow="Catálogo"
                title="Categorias"
                description="Organize as coleções da vitrine com nome, slug e imagem de capa. A estrutura certa aqui deixa navegação e busca mais claras para o cliente."
            />

            <CategoryManager initialCategories={formattedCategories} />
        </div>
    )
}
