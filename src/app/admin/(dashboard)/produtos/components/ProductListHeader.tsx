'use client'

import { Loader2, Plus } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { AdminRouteButton } from "@/components/admin/AdminRouteButton"

export function ProductListHeader() {
    return (
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
    )
}
