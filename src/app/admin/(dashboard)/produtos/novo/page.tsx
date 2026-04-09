import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function NovoProdutoPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase.from('categories').select('*').order('name')

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Criar Produto</h1>
                <p className="text-zinc-500">
                    Preencha as informações básicas, envie imagens e monte a grade de estoque do produto.
                </p>
            </div>

            <ProductForm categories={categories || []} />
        </div>
    )
}
