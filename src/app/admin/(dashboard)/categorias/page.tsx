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

    const productsLinked = formattedCategories.reduce((total, category) => total + category.productsCount, 0)

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader title="Categorias" />

            <CategoryManager initialCategories={formattedCategories} />
        </div>
    )
}
