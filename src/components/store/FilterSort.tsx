'use client'

import { useRouter, useSearchParams } from "next/navigation"

export function FilterSort({ currentSort }: { currentSort?: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('sort', value)
        } else {
            params.delete('sort')
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-4">
            <select
                defaultValue={currentSort || ''}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-10 pl-4 pr-10 bg-muted/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
                <option value="">Ordenar por</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="newest">Mais Recentes</option>
            </select>
        </div>
    )
}
