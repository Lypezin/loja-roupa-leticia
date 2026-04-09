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
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="py-4 pl-6 text-[11px] font-bold uppercase tracking-widest text-foreground">Coleção</TableHead>
                        <TableHead className="py-4 text-[11px] font-bold uppercase tracking-widest text-foreground">Produtos</TableHead>
                        <TableHead className="py-4 pr-6 text-right text-[11px] font-bold uppercase tracking-widest text-foreground">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <LayoutGrid className="h-8 w-8 opacity-20" />
                                    <p>Nenhuma categoria encontrada.</p>
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
        </div>
    )
}
