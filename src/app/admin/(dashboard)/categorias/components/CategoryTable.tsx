'use client'

import { LayoutGrid } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryTableRow } from "./CategoryTableRow"

type Category = {
    id: string
    name: string
    slug: string
    productsCount: number
    image_url?: string
}

interface CategoryTableProps {
    categories: Category[]
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

export function CategoryTable({
    categories,
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
}: CategoryTableProps) {
    return (
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-950">
                        Categorias Cadastradas
                    </h2>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-500">
                    {categories.length} categoria(s)
                </div>
            </div>

            <Table>
                <TableHeader className="bg-zinc-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="py-4 pl-6 text-xs font-semibold text-zinc-500">Categoria</TableHead>
                        <TableHead className="py-4 text-xs font-semibold text-zinc-500">Produtos</TableHead>
                        <TableHead className="py-4 pr-6 text-right text-xs font-semibold text-zinc-500">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-48 text-center text-zinc-500">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-400">
                                        <LayoutGrid className="h-6 w-6" />
                                    </span>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-zinc-700">Nenhuma categoria criada ainda.</p>
                                        <p className="text-sm text-zinc-500">Comece pela lateral e monte a estrutura do catálogo.</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((cat) => (
                            <CategoryTableRow
                                key={cat.id}
                                cat={cat}
                                editingId={editingId}
                                editName={editName}
                                setEditName={setEditName}
                                editImagePreview={editImagePreview}
                                handleImageChange={handleImageChange}
                                handleUpdate={handleUpdate}
                                handleDelete={handleDelete}
                                startEditing={startEditing}
                                cancelEditing={cancelEditing}
                                updatingId={updatingId}
                                deletingId={deletingId}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </section>
    )
}
