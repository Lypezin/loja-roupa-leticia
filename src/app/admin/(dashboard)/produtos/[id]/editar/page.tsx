import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Buscar Produto, Variações (Grade de Estoque)
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            product_variations(*)
        `)
        .eq('id', id)
        .single()

    if (error || !product) {
        return notFound()
    }

    // Buscar Categorias para o Select do form
    const { data: categories } = await supabase.from('categories').select('*').order('name')

    // Formatar o objeto product para se adequar ao que o ProductForm espera
    const formattedProduct = {
        ...product,
        variations: product.product_variations
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
                <p className="text-zinc-500">
                    Modifique informações, categorias, ou adicione novo estoque na grade.
                </p>
            </div>

            <ProductForm categories={categories || []} product={formattedProduct} />
        </div>
    )
}
