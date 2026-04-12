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
        <section className="overflow-hidden rounded-[1.8rem] border border-zinc-200/80 bg-white/90 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
            <div className="flex flex-col gap-2 border-b border-zinc-200/80 px-6 py-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Coleções cadastradas
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                        Lista de categorias
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Edite nome, imagem e organização do catálogo sem sair da tabela.
                    </p>
                </div>
                <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {categories.length} categoria(s)
                </div>
            </div>

            <Table>
                <TableHeader className="bg-zinc-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="py-4 pl-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Categoria</TableHead>
                        <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Produtos</TableHead>
                        <TableHead className="py-4 pr-6 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Ações</TableHead>
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
