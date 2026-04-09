import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            product_variations(*),
            images:product_images(id, image_url, is_primary)
        `)
        .eq('id', id)
        .single()

    if (error || !product) {
        return notFound()
    }

    const { data: categories } = await supabase.from('categories').select('*').order('name')

    const formattedProduct = {
        ...product,
        variations: product.product_variations,
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
                <p className="text-zinc-500">
                    Atualize informações, imagens e grade de estoque sem sair do painel.
                </p>
            </div>

            <ProductForm categories={categories || []} product={formattedProduct} />
        </div>
    )
}
