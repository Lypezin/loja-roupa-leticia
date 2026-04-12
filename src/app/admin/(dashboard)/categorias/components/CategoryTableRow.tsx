'use client'

import { CategoryEditRow } from "./CategoryEditRow"
import { CategoryViewRow } from "./CategoryViewRow"

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
    const isEditing = editingId === cat.id
    const isUpdating = updatingId === cat.id
    const isDeleting = deletingId === cat.id

    if (isEditing) {
        return (
            <CategoryEditRow
                id={cat.id}
                editName={editName}
                setEditName={setEditName}
                editImagePreview={editImagePreview}
                handleImageChange={handleImageChange}
                handleUpdate={handleUpdate}
                cancelEditing={cancelEditing}
                isUpdating={isUpdating}
            />
        )
    }

    return (
        <CategoryViewRow
            cat={cat}
            startEditing={startEditing}
            handleDelete={handleDelete}
            isDeleting={isDeleting}
        />
    )
}
