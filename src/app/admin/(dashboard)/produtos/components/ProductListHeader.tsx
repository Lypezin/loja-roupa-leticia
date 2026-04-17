'use client'

import { Loader2, Plus } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { AdminRouteButton } from "@/components/admin/AdminRouteButton"

export function ProductListHeader() {
    return (
        <AdminPageHeader
            eyebrow="Catálogo"
            title="Produtos"
            description="Gerencie o mix ativo da loja com foco em imagem, variações, preço e disponibilidade. Cada linha leva rápido para edição sem perder contexto."
            actions={
                <AdminRouteButton
                    href="/admin/produtos/novo"
                    className="h-11 rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
                    pendingContent={
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Carregando...
                        </>
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar produto
                </AdminRouteButton>
            }
        />
    )
}
