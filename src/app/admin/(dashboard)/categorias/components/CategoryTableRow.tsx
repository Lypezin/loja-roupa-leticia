'use client'

import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, LayoutGrid, Save, Image as ImageIcon, Loader2, ArrowRight } from "lucide-react"
import Image from "next/image"

type Category = {
    id: string
    name: string
    slug: string
    productsCount: number
    image_url?: string
}

interface CategoryTableRowProps {
    cat: Category;
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
    loadingId
}: CategoryTableRowProps) {
    const isEditing = editingId === cat.id

    if (isEditing) {
        return (
            <TableRow className="bg-muted/10">
                <TableCell colSpan={3} className="p-4 pl-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border">
                            {editImagePreview ? (
                                <Image src={editImagePreview} alt="" fill className="object-cover" />
                            ) : (
                                <ImageIcon className="w-full h-full p-4 text-muted-foreground/50" />
                            )}
                            <input
                                type="file"
                                accept={ACCEPTED_IMAGE_INPUT}
                                onChange={(e) => handleImageChange(e, true)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-10 rounded-xl bg-background"
                                placeholder="Novo nome..."
                            />
                            <p className="text-[10px] text-muted-foreground font-medium">Clique na imagem para alterar</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => handleUpdate(cat.id)}
                                disabled={loadingId === cat.id}
                                className="h-10 px-4 rounded-xl"
                            >
                                {loadingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Salvar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                className="h-10 px-4 rounded-xl"
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
        <TableRow className="group hover:bg-muted/30 transition-colors">
            <TableCell className="py-4 pl-6">
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl bg-muted border border-border overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {cat.image_url ? (
                            <Image src={cat.image_url} alt="" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <LayoutGrid className="w-4 h-4 text-muted-foreground/50" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-foreground group-hover:text-foreground/80 transition-colors uppercase tracking-tight">{cat.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{cat.slug}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-4">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-foreground">{cat.productsCount}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">itens</span>
                </div>
            </TableCell>
            <TableCell className="py-4 text-right pr-6">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(cat)}
                        className="w-9 h-9 rounded-xl border border-transparent hover:border-border hover:bg-background transition-all text-muted-foreground hover:text-primary"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cat.id, cat.name, cat.productsCount)}
                        className="w-9 h-9 rounded-xl border border-transparent hover:border-border hover:bg-background transition-all text-muted-foreground hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
                <div className="group-hover:hidden">
                    <ArrowRight className="w-4 h-4 text-muted-foreground/25 ml-auto" />
                </div>
            </TableCell>
        </TableRow>
    )
}
