import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
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
                <div className="p-4 border-b flex items-center gap-4 bg-zinc-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input placeholder="Buscar produtos..." className="pl-9 bg-white" />
                    </div>
                </div>
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
                                    <TableRow key={product.id} className="hover:bg-zinc-50 transition-colors">
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-zinc-500">
                                            {categoryName}
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-700'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-500' : 'bg-zinc-400'}`}></span>
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
