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

import { ProductTable } from "./components/ProductTable"

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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Produtos</h1>
                    <p className="text-muted-foreground text-sm mt-1">Gerencie seu catálogo de {products?.length || 0} produtos.</p>
                </div>
                <Button asChild className="rounded-xl px-6 h-11 cursor-pointer shadow-sm">
                    <Link href="/admin/produtos/novo">
                        <Plus className="w-4 h-4 mr-2" /> Cadastrar Produto
                    </Link>
                </Button>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between gap-4 bg-muted/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar por nome ou categoria..." className="pl-10 h-10 rounded-xl bg-background" />
                    </div>
                    {/* Filtros simplificados para o componente principal */}
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Filtrar:</span>
                        <select className="bg-background border border-input text-xs font-medium rounded-lg px-3 py-1.5">
                            <option>Todos</option><option>Ativos</option><option>Ocultos</option>
                        </select>
                    </div>
                </div>

                {products && products.length > 0 ? (
                    <ProductTable products={products} />
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Sem produtos no momento</h3>
                        <Button asChild className="px-8 rounded-xl h-11 mt-4">
                            <Link href="/admin/produtos/novo">
                                <Plus className="w-4 h-4 mr-2" /> Cadastrar Primeiro Produto
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
