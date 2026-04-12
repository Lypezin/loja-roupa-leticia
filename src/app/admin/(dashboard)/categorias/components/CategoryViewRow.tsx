'use client'

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, LayoutGrid, Loader2, Pencil, Trash2 } from "lucide-react"
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"

type Category = {
    id: string
    name: string
    slug: string
    productsCount: number
    image_url?: string
}

interface CategoryViewRowProps {
    cat: Category
    startEditing: (cat: Category) => void
    handleDelete: (id: string, name: string, count: number) => void
    isDeleting: boolean
}

export function CategoryViewRow({
    cat,
    startEditing,
    handleDelete,
    isDeleting,
}: CategoryViewRowProps) {
    const [deleteOpen, setDeleteOpen] = useState(false)

    return (
        <>
            <TableRow className="group transition-colors hover:bg-zinc-50/70">
                <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
                            {cat.image_url ? (
                                <Image src={cat.image_url} alt="" fill className="object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <LayoutGrid className="h-4 w-4 text-zinc-400" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-zinc-950">{cat.name}</p>
                            <p className="mt-1 text-xs text-zinc-500">
                                /{cat.slug}
                            </p>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="py-4">
                    <div className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                        {cat.productsCount} item(ns)
                    </div>
                </TableCell>
                <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(cat)}
                            className="h-9 w-9 text-zinc-500"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteOpen(true)}
                            className="h-9 w-9 text-zinc-500 hover:text-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                        <ArrowRight className="hidden h-4 w-4 text-zinc-300 xl:block" />
                    </div>
                </TableCell>
            </TableRow>

            <AdminConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Excluir categoria"
                description={`Tem certeza que deseja excluir "${cat.name}"? Se houver produtos vinculados, a exclusão será bloqueada.`}
                confirmLabel="Excluir categoria"
                onConfirm={() => handleDelete(cat.id, cat.name, cat.productsCount)}
                isLoading={isDeleting}
            />
        </>
    )
}
