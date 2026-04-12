'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export type StatusFilter = "all" | "active" | "hidden"

interface ProductFiltersProps {
    query: string
    onQueryChange: (query: string) => void
    statusFilter: StatusFilter
    onStatusFilterChange: (status: StatusFilter) => void
    activeCount: number
}

export function ProductFilters({
    query,
    onQueryChange,
    statusFilter,
    onStatusFilterChange,
    activeCount
}: ProductFiltersProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Buscar por nome ou categoria..."
                    className="h-10 pl-9"
                />
            </div>

            <div className="flex items-center gap-3">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                    {activeCount} ativo(s)
                </span>
                <select
                    value={statusFilter}
                    onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
                    className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900"
                >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativos</option>
                    <option value="hidden">Ocultos</option>
                </select>
            </div>
        </div>
    )
}
