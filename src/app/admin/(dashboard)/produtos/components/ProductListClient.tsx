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
                eyebrow="Catálogo"
                title="Produtos com edição mais clara."
                description="Gerencie o catálogo com uma leitura mais objetiva: busca, status, categoria, capa e acesso direto ao formulário completo."
                actions={
                    <AdminRouteButton
                        href="/admin/produtos/novo"
                        className="h-12 rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800"
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
                }
                metrics={[
                    { label: "Catálogo total", value: String(products.length), description: "Todos os itens cadastrados." },
                    { label: "Ativos", value: String(activeProducts), description: "Produtos visíveis na loja." },
                    { label: "Ocultos", value: String(hiddenProducts), description: "Itens fora da vitrine." },
                    { label: "Sem categoria", value: String(uncategorizedProducts), description: "Produtos que ainda precisam de organização." },
                ]}
            />

            <section className="overflow-hidden rounded-[1.8rem] border border-zinc-200/80 bg-white/90 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                <div className="flex flex-col gap-4 border-b border-zinc-200/80 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Lista operacional
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                            Catálogo e filtros
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Busque por nome ou categoria e alterne rapidamente entre produtos ativos e ocultos.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Buscar por nome ou categoria..."
                                className="h-11 rounded-full border-zinc-200 bg-zinc-50/60 pl-10"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                            className="h-11 cursor-pointer rounded-full border border-zinc-200 bg-zinc-50/60 px-4 text-sm font-medium text-zinc-700"
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
