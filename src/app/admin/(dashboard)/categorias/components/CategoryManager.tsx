'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Loader2, Pencil, Save, LayoutGrid, Image as ImageIcon, ArrowRight } from "lucide-react"
import { createCategory, deleteCategory, updateCategory } from "../actions"
import { toast } from "sonner"
import Image from "next/image"

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
        if (image) {
            formData.append('image', image)
        }

        const res = await createCategory(formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Categoria criada com sucesso!")
            setName('')
            setImage(null)
            setImagePreview(null)
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
            toast.error(res.error)
        } else {
            toast.success("Categoria atualizada com sucesso!")
            setEditingId(null)
            setEditName('')
            setEditImage(null)
            setEditImagePreview(null)
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
            if (res?.error) {
                toast.error(res.error)
            } else {
                toast.success("Categoria excluída com sucesso!")
            }
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header com Estatística rápida */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Categorias</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Organize seus produtos em {initialCategories.length} coleções.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulário lateral */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleCreate} className="bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                                <Plus className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <h2 className="font-bold text-foreground">Nova Categoria</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Nome da Categoria
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Tênis, Camisetas..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    className="h-11 rounded-xl bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Imagem de Capa
                                </label>
                                <div className="group relative w-full h-32 rounded-xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden hover:border-border/80 transition-colors">
                                    {imagePreview ? (
                                        <>
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="w-6 h-6 text-muted-foreground/50 mb-1" />
                                            <span className="text-[10px] text-muted-foreground font-medium">PNG ou JPG (800x400 recomendado)</span>
                                        </>
                                    )}
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e)}
                                        disabled={isLoading}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                            className="w-full h-11 rounded-xl shadow-sm transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Plus className="w-4 h-4 mr-2" />
                            )}
                            Criar Coleção
                        </Button>
                    </form>
                </div>

                {/* Lista principal */}
                <div className="lg:col-span-2">
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
                                {initialCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <LayoutGrid className="w-8 h-8 opacity-20" />
                                                <p>Nenhuma categoria encontrada.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    initialCategories.map((cat) => (
                                        <TableRow key={cat.id} className="group hover:bg-muted/30 transition-colors">
                                            {editingId === cat.id ? (
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
                                                                accept="image/*"
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
                                            ) : (
                                                <>
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
                                                </>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
