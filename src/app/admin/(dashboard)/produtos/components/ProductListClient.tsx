'use client'

import { useState } from 'react'
import { Loader2, Package, Plus, Search } from 'lucide-react'
import { AdminRouteButton } from '@/components/admin/AdminRouteButton'
import { Input } from '@/components/ui/input'
import { ProductTable, type ProductTableProduct } from './ProductTable'

interface ProductListClientProps {
    products: ProductTableProduct[]
}

type StatusFilter = 'all' | 'active' | 'hidden'

export function ProductListClient({ products }: ProductListClientProps) {
    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

    const normalizedQuery = query.trim().toLowerCase()

    const filteredProducts = products.filter((product) => {
        const category = product.category
        const categoryName = Array.isArray(category)
            ? (category[0]?.name ?? '')
            : (category?.name ?? '')

        const matchesQuery = normalizedQuery.length === 0
            || product.name.toLowerCase().includes(normalizedQuery)
            || categoryName.toLowerCase().includes(normalizedQuery)

        const matchesStatus = statusFilter === 'all'
            || (statusFilter === 'active' && Boolean(product.is_active))
            || (statusFilter === 'hidden' && !product.is_active)

        return matchesQuery && matchesStatus
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Produtos</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie seu catálogo de {products.length} produto(s).
                    </p>
                </div>

                <AdminRouteButton
                    href="/admin/produtos/novo"
                    className="h-11 rounded-xl px-6 shadow-sm"
                    pendingContent={
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Abrindo formulário...
                        </>
                    }
                >
                    <Plus className="h-4 w-4" />
                    Cadastrar produto
                </AdminRouteButton>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col gap-4 border-b border-border bg-muted/30 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar por nome ou categoria..."
                            className="h-10 rounded-xl bg-background pl-10"
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Filtrar:
                        </span>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                            className="rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium"
                        >
                            <option value="all">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="hidden">Ocultos</option>
                        </select>
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <ProductTable products={filteredProducts} />
                ) : (
                    <div className="p-16 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Package className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-foreground">
                            {products.length === 0 ? 'Sem produtos no momento' : 'Nenhum resultado encontrado'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {products.length === 0
                                ? 'Cadastre seu primeiro produto para começar a vender.'
                                : 'Ajuste a busca ou o filtro para encontrar o produto que você quer editar.'}
                        </p>
                        {products.length === 0 ? (
                            <AdminRouteButton
                                href="/admin/produtos/novo"
                                className="mt-4 h-11 rounded-xl px-8"
                                pendingContent={
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Abrindo formulário...
                                    </>
                                }
                            >
                                <Plus className="h-4 w-4" />
                                Cadastrar primeiro produto
                            </AdminRouteButton>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    )
}
