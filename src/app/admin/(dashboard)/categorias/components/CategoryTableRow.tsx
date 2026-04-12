'use client'

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Image as ImageIcon, LayoutGrid, Loader2, Pencil, Save, Trash2 } from "lucide-react"
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"

type Category = {
    id: string
    name: string
    slug: string
    productsCount: number
    image_url?: string
}

interface CategoryTableRowProps {
    cat: Category
    editingId: string | null
    editName: string
    setEditName: (val: string) => void
    editImagePreview: string | null
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => void
    handleUpdate: (id: string) => void
    handleDelete: (id: string, name: string, count: number) => void
    startEditing: (cat: Category) => void
    cancelEditing: () => void
    updatingId: string | null
    deletingId: string | null
}

export function CategoryTableRow({
    cat,
    editingId,
    editName,
    setEditName,
    editImagePreview,
    handleImageChange,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
    updatingId,
    deletingId,
}: CategoryTableRowProps) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const isEditing = editingId === cat.id
    const isUpdating = updatingId === cat.id
    const isDeleting = deletingId === cat.id

    if (isEditing) {
        return (
            <TableRow className="bg-zinc-50/60">
                <TableCell colSpan={3} className="p-4 pl-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                        <label className="relative flex h-24 w-full max-w-[9rem] cursor-pointer overflow-hidden rounded-md border border-zinc-200 bg-white">
                            {editImagePreview ? (
                                <Image src={editImagePreview} alt="" fill className="object-cover" />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center text-zinc-400">
                                    <ImageIcon className="h-6 w-6" />
                                </span>
                            )}
                            <input
                                type="file"
                                accept={ACCEPTED_IMAGE_INPUT}
                                onChange={(e) => handleImageChange(e, true)}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                        </label>

                        <div className="flex-1 space-y-2">
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-10 rounded-md border-zinc-200 bg-white"
                                placeholder="Nome da categoria"
                            />
                            <p className="text-xs text-zinc-500">
                                Troque a capa ou ajuste o nome antes de salvar.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => handleUpdate(cat.id)}
                                disabled={isUpdating}
                                className="h-9 px-4 text-white"
                            >
                                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Salvar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                className="h-9 px-4"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        )
    }

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
