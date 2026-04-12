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
            <AdminPageHeader
                eyebrow="Catálogo"
                title="Categorias bem organizadas."
                description="Crie coleções com nome, capa e slug limpos para manter a navegação da loja mais clara. O objetivo aqui é reduzir atrito entre vitrine, busca e edição."
                metrics={[
                    { label: "Coleções", value: String(formattedCategories.length), description: "Categorias cadastradas no momento." },
                    { label: "Produtos vinculados", value: String(productsLinked), description: "Itens já distribuídos nas coleções." },
                    { label: "Sem imagem", value: String(formattedCategories.filter((category) => !category.image_url).length), description: "Categorias que ainda podem ganhar capa." },
                ]}
            />

            <CategoryManager initialCategories={formattedCategories} />
        </div>
    )
}
