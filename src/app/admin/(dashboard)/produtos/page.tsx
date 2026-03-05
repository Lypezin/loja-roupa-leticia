import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AdminProdutos() {
    const supabase = await createClient()

    // Buscar todos os produtos junto com suas respectivas categorias
    const { data: products, error } = await supabase
        .from('products')
        .select(`
      *,
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
                <Button className="flex items-center gap-2 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Novo Produto
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
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-zinc-500">
                                        {/* @ts-ignore */}
                                        {product.category?.name || 'Sem categoria'}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}>
                                            {product.is_active ? 'Ativo' : 'Oculto'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right text-zinc-500">
                                        <Button variant="ghost" size="sm" className="cursor-pointer">Editar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-8 text-center text-zinc-500">
                        Nenhum produto cadastrado ainda.
                    </div>
                )}
            </div>
        </div>
    )
}
