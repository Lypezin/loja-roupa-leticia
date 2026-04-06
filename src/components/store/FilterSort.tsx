'use client'

import { ArrowDownWideNarrow } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function FilterSort({ currentSort }: { currentSort?: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set("sort", value)
        } else {
            params.delete("sort")
        }

        params.delete("page")

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex w-full items-center sm:w-auto">
            <div className="relative w-full sm:w-auto">
                <ArrowDownWideNarrow className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                    defaultValue={currentSort || ""}
                    onChange={(event) => handleSortChange(event.target.value)}
                    className="h-11 w-full appearance-none rounded-full border border-border bg-card pl-11 pr-16 text-sm text-card-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-w-56"
                >
                    <option value="">Ordenar por</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                    <option value="newest">Mais recentes</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    filtro
                </span>
            </div>
        </div>
    )
}
