'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Loader2, Pencil, Save, LayoutGrid, Image as ImageIcon, ArrowRight } from "lucide-react"
import { createCategory, deleteCategory, updateCategory } from "../actions"
import { toast } from "sonner"
import Image from "next/image"

import { CategoryForm } from "./CategoryForm"
import { CategoryTable } from "./CategoryTable"

type Category = {
    id: string
    name: string
    slug: string
    productsCount: number
    image_url?: string
}

interface CategoryManagerProps {
    initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editImage, setEditImage] = useState<File | null>(null)
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
        const file = e.target.files?.[0] || null
        if (isEdit) {
            setEditImage(file)
            if (file) setEditImagePreview(URL.createObjectURL(file))
            else setEditImagePreview(null)
        } else {
            setImage(file)
            if (file) setImagePreview(URL.createObjectURL(file))
            else setImagePreview(null)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        const formData = new FormData()
        formData.append('name', name.trim())
        if (image) formData.append('image', image)

        const res = await createCategory(formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Categoria criada com sucesso!")
            setName('')
            setImage(null)
            setImagePreview(null)
        }
        setIsLoading(false)
    }

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return
        setLoadingId(id)
        const formData = new FormData()
        formData.append('name', editName.trim())
        if (editImage) formData.append('image', editImage)

        const res = await updateCategory(id, formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Categoria atualizada com sucesso!")
            cancelEditing()
        }
        setLoadingId(null)
    }

    const startEditing = (cat: Category) => {
        setEditingId(cat.id)
        setEditName(cat.name)
        setEditImage(null)
        setEditImagePreview(cat.image_url || null)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditName('')
        setEditImage(null)
        setEditImagePreview(null)
    }

    const handleDelete = async (id: string, name: string, count: number) => {
        if (count > 0) {
            toast.error(`A categoria "${name}" tem ${count} produto(s). Remova os produtos dela antes de excluir.`)
            return
        }
        if (confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
            const res = await deleteCategory(id)
            if (res?.error) toast.error(res.error)
            else toast.success("Categoria excluída com sucesso!")
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Categorias</h1>
                <p className="text-muted-foreground text-sm mt-1">Organize seus produtos em {initialCategories.length} coleções.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CategoryForm 
                    name={name}
                    setName={setName}
                    imagePreview={imagePreview}
                    handleImageChange={(e) => handleImageChange(e)}
                    handleCreate={handleCreate}
                    isLoading={isLoading}
                />

                <div className="lg:col-span-2">
                    <CategoryTable 
                        categories={initialCategories}
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
                </div>
            </div>
        </div>
    )
}
