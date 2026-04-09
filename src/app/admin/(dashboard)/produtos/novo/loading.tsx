import { ProductFormSkeleton } from '@/components/admin/ProductFormSkeleton'

export default function NewProductLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Criar Produto</h1>
                <p className="text-zinc-500">Carregando formulário do produto...</p>
            </div>

            <ProductFormSkeleton />
        </div>
    )
}
