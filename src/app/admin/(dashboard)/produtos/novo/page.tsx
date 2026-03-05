import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function NovoProdutoPage() {
    const supabase = await createClient()

    // Buscar Categorias para o Select do form
    const { data: categories } = await supabase.from('categories').select('*').order('name')

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Criar Produto</h1>
                <p className="text-zinc-500">
                    Preencha as informações básicas e adicione os tamanhos e cores disponíveis.
                </p>
            </div>

            <ProductForm categories={categories || []} />
        </div>
    )
}
