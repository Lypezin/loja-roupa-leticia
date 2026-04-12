'use client'

import { Package, Plus, Loader2 } from "lucide-react"
import { AdminRouteButton } from "@/components/admin/AdminRouteButton"

interface ProductEmptyStateProps {
    hasProducts: boolean
}

export function ProductEmptyState({ hasProducts }: ProductEmptyStateProps) {
    return (
        <div className="p-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                <Package className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-950">
                {!hasProducts ? "Sem produtos no momento" : "Nenhum resultado encontrado"}
            </h3>
            <p className="text-sm leading-6 text-zinc-600">
                {!hasProducts
                    ? "Cadastre seu primeiro produto para começar a vender."
                    : "Ajuste a busca ou o filtro para encontrar o produto que deseja editar."}
            </p>
            {!hasProducts && (
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
            )}
        </div>
    )
}
