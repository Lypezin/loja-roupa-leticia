import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Package, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
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
            category:categories(name),
            images:product_images(image_url, is_primary)
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Produtos</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Gerencie seu catálogo de {products?.length || 0} produtos.
                    </p>
                </div>
                <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl px-6 h-11 cursor-pointer shadow-sm">
                    <Link href="/admin/produtos/novo">
                        <Plus className="w-4 h-4 mr-2" />
                        Cadastrar Produto
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-zinc-50 flex items-center justify-between gap-4 bg-zinc-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Buscar por nome ou categoria..."
                            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl focus-visible:ring-zinc-200 transition-all"
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Filtrar por:</span>
                        <select className="bg-white border border-zinc-200 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-200">
                            <option>Todos</option>
                            <option>Ativos</option>
                            <option>Ocultos</option>
                        </select>
                    </div>
                </div>

                {products && products.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="font-semibold text-zinc-900 py-4 h-auto">Produto</TableHead>
                                    <TableHead className="font-semibold text-zinc-900 py-4 h-auto">Categoria</TableHead>
                                    <TableHead className="font-semibold text-zinc-900 py-4 h-auto">Preço Base</TableHead>
                                    <TableHead className="font-semibold text-zinc-900 py-4 h-auto">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-zinc-900 py-4 h-auto">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => {
                                    const category = product.category as any
                                    const categoryName = category
                                        ? (Array.isArray(category) ? category[0]?.name : category.name)
                                        : 'Sem categoria'

                                    const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url
                                        || product.images?.[0]?.image_url

                                    return (
                                        <TableRow key={product.id} className="group hover:bg-zinc-50 transition-all duration-200 border-zinc-50">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-12 h-12 rounded-xl bg-zinc-100 flex-shrink-0 overflow-hidden border border-zinc-100 group-hover:border-zinc-200 transition-colors">
                                                        {primaryImage ? (
                                                            <Image src={primaryImage} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="w-5 h-5 text-zinc-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-zinc-900 leading-none mb-1 group-hover:text-zinc-600 transition-colors">{product.name}</p>
                                                        <p className="text-xs text-zinc-400 font-medium">ID: {product.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-bold uppercase tracking-tight">
                                                    {categoryName}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="font-medium text-zinc-900">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.is_active ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                                                    {product.is_active ? 'Ativo' : 'Oculto'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer border border-transparent hover:border-zinc-100">
                                                        <Link href={`/admin/produtos/${product.id}/editar`}>
                                                            <Pencil className="w-3.5 h-3.5 text-zinc-500" />
                                                        </Link>
                                                    </Button>
                                                    <DeleteProductButton productId={product.id} productName={product.name} />
                                                </div>
                                                <div className="group-hover:hidden pr-2">
                                                    <MoreVertical className="w-4 h-4 text-zinc-300 ml-auto" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-8 h-8 text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Sem produtos no momento</h3>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-8">
                            Seu catálogo está vazio. Comece adicionando seu primeiro produto agora mesmo.
                        </p>
                        <Button asChild className="bg-black text-white px-8 rounded-xl h-11">
                            <Link href="/admin/produtos/novo">
                                <Plus className="w-4 h-4 mr-2" />
                                Cadastrar Primeiro Produto
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
