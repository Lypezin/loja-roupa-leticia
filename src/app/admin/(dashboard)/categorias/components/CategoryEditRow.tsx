'use client'

import Image from "next/image"
import { ImageIcon, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"

interface CategoryEditRowProps {
    id: string
    editName: string
    setEditName: (val: string) => void
    editImagePreview: string | null
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => void
    handleUpdate: (id: string) => void
    cancelEditing: () => void
    isUpdating: boolean
}

export function CategoryEditRow({
    id,
    editName,
    setEditName,
    editImagePreview,
    handleImageChange,
    handleUpdate,
    cancelEditing,
    isUpdating,
}: CategoryEditRowProps) {
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
                            onClick={() => handleUpdate(id)}
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
