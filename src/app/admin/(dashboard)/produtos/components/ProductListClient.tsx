'use client'

import { useMemo, useState } from "react"
import { ProductTable, type ProductTableProduct } from "./ProductTable"
import { ProductListHeader } from "./ProductListHeader"
import { ProductFilters, type StatusFilter } from "./ProductFilters"
import { ProductEmptyState } from "./ProductEmptyState"

interface ProductListClientProps {
    products: ProductTableProduct[]
}

export function ProductListClient({ products }: ProductListClientProps) {
    const [query, setQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

    const filteredProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
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
    }, [query, products, statusFilter])

    const activeCount = products.filter((p) => p.is_active).length

    return (
        <div className="flex flex-col gap-6">
            <ProductListHeader />

            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <ProductFilters
                    query={query}
                    onQueryChange={setQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    activeCount={activeCount}
                />

                {filteredProducts.length > 0 ? (
                    <ProductTable products={filteredProducts} />
                ) : (
                    <ProductEmptyState hasProducts={products.length > 0} />
                )}
            </section>
        </div>
    )
}
