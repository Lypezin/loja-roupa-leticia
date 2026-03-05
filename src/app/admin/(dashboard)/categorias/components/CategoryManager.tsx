'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Loader2, Pencil, X, Save } from "lucide-react"
import { createCategory, deleteCategory, updateCategory } from "../actions"

type Category = {
    id: string
    name: string
    slug: string
    productsCount: number
}

interface CategoryManagerProps {
    initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [image, setImage] = useState<File | null>(null)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editImage, setEditImage] = useState<File | null>(null)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        const formData = new FormData()
        formData.append('name', name.trim())
        if (image) {
            formData.append('image', image)
        }

        const res = await createCategory(formData)
        if (res?.error) {
            alert(res.error)
        } else {
            setName('')
            setImage(null)
            // Reset do file input
            const fileInput = document.getElementById('image') as HTMLInputElement
            if (fileInput) fileInput.value = ''
        }
        setIsLoading(false)
    }

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return

        setLoadingId(id)
        const formData = new FormData()
        formData.append('name', editName.trim())
        if (editImage) {
            formData.append('image', editImage)
        }

        const res = await updateCategory(id, formData)
        if (res?.error) {
            alert(res.error)
        } else {
            setEditingId(null)
            setEditName('')
            setEditImage(null)
        }
        setLoadingId(null)
    }

    const startEditing = (cat: Category) => {
        setEditingId(cat.id)
        setEditName(cat.name)
        setEditImage(null)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditName('')
        setEditImage(null)
    }

    const handleDelete = async (id: string, name: string, count: number) => {
        if (count > 0) {
            alert(`A categoria "${name}" tem ${count} produto(s). Remova os produtos dela antes de excluir.`)
            return
        }

        if (confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
            const res = await deleteCategory(id)
            if (res?.error) {
                alert(res.error)
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Criar Nova */}
            <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3 max-w-3xl items-end bg-white p-4 rounded-xl border">
                <div className="flex-1 space-y-2 w-full">
                    <label htmlFor="name" className="text-sm font-medium leading-none">
                        Adicionar Nova Categoria
                    </label>
                    <Input
                        id="name"
                        placeholder="Ex: Tênis"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex-1 space-y-2 w-full">
                    <label htmlFor="image" className="text-sm font-medium leading-none">
                        Imagem de Capa (Opcional)
                    </label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        disabled={isLoading}
                    />
                </div>
                <Button type="submit" disabled={isLoading || !name.trim()} className="cursor-pointer">
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Adicionando...
                        </span>
                    ) : (
                        <><Plus className="w-4 h-4 mr-2" /> Adicionar</>
                    )}
                </Button>
            </form>

            <div className="bg-white rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Slug (URL)</TableHead>
                            <TableHead>Nº de Produtos</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                    Nenhuma categoria cadastrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialCategories.map((cat) => (
                                <TableRow key={cat.id}>
                                    {editingId === cat.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full"
                                                />
                                            </TableCell>
                                            <TableCell colSpan={2}>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                                                    className="w-full text-xs"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleUpdate(cat.id)}
                                                        disabled={loadingId === cat.id}
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        title="Salvar"
                                                    >
                                                        {loadingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={cancelEditing}
                                                        disabled={loadingId === cat.id}
                                                        className="text-zinc-500 hover:text-zinc-700"
                                                        title="Cancelar"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="font-medium">{cat.name}</TableCell>
                                            <TableCell className="text-zinc-500">{cat.slug}</TableCell>
                                            <TableCell>{cat.productsCount}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => startEditing(cat)}
                                                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(cat.id, cat.name, cat.productsCount)}
                                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
