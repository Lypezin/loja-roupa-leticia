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
            <TableRow className="bg-muted/10">
                <TableCell colSpan={3} className="p-4 pl-6">
                    <div className="flex flex-col items-center gap-4 md:flex-row">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-border bg-muted">
                            {editImagePreview ? (
                                <Image src={editImagePreview} alt="" fill className="object-cover" />
                            ) : (
                                <ImageIcon className="h-full w-full p-4 text-muted-foreground/50" />
                            )}
                            <input
                                type="file"
                                accept={ACCEPTED_IMAGE_INPUT}
                                onChange={(e) => handleImageChange(e, true)}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-10 rounded-xl bg-background"
                                placeholder="Novo nome..."
                            />
                            <p className="text-[10px] font-medium text-muted-foreground">Clique na imagem para alterar.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => handleUpdate(cat.id)}
                                disabled={isUpdating}
                                className="h-10 rounded-xl px-4"
                            >
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Salvar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                className="h-10 rounded-xl px-4"
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
            <TableRow className="group transition-colors hover:bg-muted/30">
                <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted transition-transform duration-300 group-hover:scale-105">
                            {cat.image_url ? (
                                <Image src={cat.image_url} alt="" fill className="object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <LayoutGrid className="h-4 w-4 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-foreground/80">{cat.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{cat.slug}</p>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-foreground">{cat.productsCount}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">itens</span>
                    </div>
                </TableCell>
                <TableCell className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(cat)}
                            className="h-9 w-9 rounded-xl border border-transparent text-muted-foreground transition-all hover:border-border hover:bg-background hover:text-primary"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteOpen(true)}
                            className="h-9 w-9 rounded-xl border border-transparent text-muted-foreground transition-all hover:border-border hover:bg-background hover:text-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="hidden sm:block sm:group-hover:hidden">
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground/25" />
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
