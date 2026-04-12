'use client'

import { useMemo, useState } from "react"
import { Loader2, Package, Plus, Search } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { AdminRouteButton } from "@/components/admin/AdminRouteButton"
import { Input } from "@/components/ui/input"
import { ProductTable, type ProductTableProduct } from "./ProductTable"

interface ProductListClientProps {
    products: ProductTableProduct[]
}

type StatusFilter = "all" | "active" | "hidden"

export function ProductListClient({ products }: ProductListClientProps) {
    const [query, setQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

    const normalizedQuery = query.trim().toLowerCase()

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const category = product.category
            const categoryName = Array.isArray(category)
                ? (category[0]?.name ?? "")
                : (category?.name ?? "")

            const matchesQuery = normalizedQuery.length === 0
                || product.name.toLowerCase().includes(normalizedQuery)
                || categoryName.toLowerCase().includes(normalizedQuery)

            const matchesStatus = statusFilter === "all"
                || (statusFilter === "active" && Boolean(product.is_active))
                || (statusFilter === "hidden" && !product.is_active)

            return matchesQuery && matchesStatus
        })
    }, [normalizedQuery, products, statusFilter])

    const activeProducts = products.filter((product) => Boolean(product.is_active)).length
    const hiddenProducts = products.length - activeProducts
    const uncategorizedProducts = products.filter((product) => {
        const category = product.category
        if (Array.isArray(category)) {
            return !category[0]?.name
        }
        return !category?.name
    }).length

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Produtos"
                actions={
                    <AdminRouteButton
                        href="/admin/produtos/novo"
                        className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                        pendingContent={
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Carregando...
                            </>
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar
                    </AdminRouteButton>
                }
            />

            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar por nome ou categoria..."
                            className="h-10 pl-9"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                        className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="active">Ativos</option>
                        <option value="hidden">Ocultos</option>
                    </select>
                </div>

                {filteredProducts.length > 0 ? (
                    <ProductTable products={filteredProducts} />
                ) : (
                    <div className="p-16 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                            <Package className="h-8 w-8 text-zinc-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-zinc-950">
                            {products.length === 0 ? "Sem produtos no momento" : "Nenhum resultado encontrado"}
                        </h3>
                        <p className="text-sm leading-6 text-zinc-600">
                            {products.length === 0
                                ? "Cadastre seu primeiro produto para começar a vender."
                                : "Ajuste a busca ou o filtro para encontrar o produto que deseja editar."}
                        </p>
                        {products.length === 0 ? (
                            <AdminRouteButton
                                href="/admin/produtos/novo"
                                className="mt-5 h-11 rounded-full bg-zinc-950 px-8 text-white hover:bg-zinc-800"
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
            </section>
        </div>
    )
}
