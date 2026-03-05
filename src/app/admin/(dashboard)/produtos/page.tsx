import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DeleteProductButton } from "./components/DeleteProductButton"

export default async function AdminProdutos() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select(`
            id,
            name,
            base_price,
            is_active,
            category:categories(name)
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-zinc-500">
                        Gerencie o catálogo da sua loja aqui.
                    </p>
                </div>
                <Button asChild className="flex items-center gap-2 cursor-pointer">
                    <Link href="/admin/produtos/novo">
                        <Plus className="w-4 h-4" />
                        Novo Produto
                    </Link>
                </Button>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                {products && products.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Preço Base</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => {
                                const category = product.category as any
                                const categoryName = category
                                    ? (Array.isArray(category) ? category[0]?.name : category.name)
                                    : 'Sem categoria'

                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-zinc-500">
                                            {categoryName}
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}>
                                                {product.is_active ? 'Ativo' : 'Oculto'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button asChild variant="ghost" size="sm" className="cursor-pointer">
                                                    <Link href={`/admin/produtos/${product.id}/editar`}>
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <DeleteProductButton productId={product.id} productName={product.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-8 text-center text-zinc-500">
                        <p className="mb-4">Nenhum produto cadastrado ainda.</p>
                        <Button asChild variant="outline">
                            <Link href="/admin/produtos/novo">
                                Criar Primeiro Produto
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
