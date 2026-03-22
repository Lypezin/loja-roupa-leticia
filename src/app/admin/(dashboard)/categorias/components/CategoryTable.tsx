'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, LayoutGrid, ArrowRight, Save, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

type Category = {
    id: string
    name: string
    slug: string
    productsCount: number
    image_url?: string
}

interface CategoryTableProps {
    categories: Category[];
    editingId: string | null;
    editName: string;
    setEditName: (val: string) => void;
    editImagePreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => void;
    handleUpdate: (id: string) => void;
    handleDelete: (id: string, name: string, count: number) => void;
    startEditing: (cat: Category) => void;
    cancelEditing: () => void;
    loadingId: string | null;
}

import { CategoryTableRow } from "./CategoryTableRow"

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
    loadingId
}: CategoryTableProps) {
    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold text-foreground py-4 uppercase text-[11px] tracking-widest pl-6">Coleção</TableHead>
                        <TableHead className="font-bold text-foreground py-4 uppercase text-[11px] tracking-widest">Produtos</TableHead>
                        <TableHead className="text-right font-bold text-foreground py-4 uppercase text-[11px] tracking-widest pr-6">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <LayoutGrid className="w-8 h-8 opacity-20" />
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
                                loadingId={loadingId}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
