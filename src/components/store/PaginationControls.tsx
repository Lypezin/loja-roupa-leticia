import Link from "next/link"

interface PaginationControlsProps {
    basePath: string
    currentPage: number
    searchParams?: Record<string, string | undefined>
    totalPages?: number | null
    hasNextPage?: boolean
}

export function PaginationControls({
    basePath,
    currentPage,
    searchParams = {},
    totalPages = null,
    hasNextPage = false,
}: PaginationControlsProps) {
    const shouldRender = totalPages !== null
        ? totalPages > 1
        : currentPage > 1 || hasNextPage

    if (!shouldRender) {
        return null
    }

    const createHref = (page: number) => {
        const params = new URLSearchParams()

        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            }
        })

        if (page > 1) {
            params.set("page", String(page))
        } else {
            params.delete("page")
        }

        const query = params.toString()
        return query ? `${basePath}?${query}` : basePath
    }

    const previousPage = currentPage - 1
    const nextPage = currentPage + 1
    const canGoNext = totalPages !== null ? currentPage < totalPages : hasNextPage

    return (
        <nav className="mt-10 flex flex-col gap-4 rounded-[1.8rem] border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                {totalPages !== null ? `Página ${currentPage} de ${totalPages}` : `Página ${currentPage}`}
            </p>

            <div className="flex items-center gap-3">
                {currentPage > 1 ? (
                    <Link
                        href={createHref(previousPage)}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                        Página anterior
                    </Link>
                ) : (
                    <span className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-muted-foreground/60">
                        Página anterior
                    </span>
                )}

                {canGoNext ? (
                    <Link
                        href={createHref(nextPage)}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        Próxima página
                    </Link>
                ) : (
                    <span className="inline-flex h-11 items-center justify-center rounded-full bg-primary/20 px-5 text-sm font-semibold text-primary/60">
                        Próxima página
                    </span>
                )}
            </div>
        </nav>
    )
}
