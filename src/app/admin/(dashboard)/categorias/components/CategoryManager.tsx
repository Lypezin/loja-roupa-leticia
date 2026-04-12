'use client'

import { CategoryForm } from "./CategoryForm"
import { CategoryTable } from "./CategoryTable"
import { useCategoryManager, Category } from "../hooks/useCategoryManager"

interface CategoryManagerProps {
    initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
    const {
        isLoading,
        updatingId,
        deletingId,
        name,
        setName,
        imagePreview,
        editingId,
        editName,
        setEditName,
        editImagePreview,
        handleImageChange,
        handleCreate,
        handleUpdate,
        startEditing,
        cancelEditing,
        handleDelete
    } = useCategoryManager()

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="xl:sticky xl:top-8 xl:self-start">
                <CategoryForm
                    name={name}
                    setName={setName}
                    imagePreview={imagePreview}
                    handleImageChange={(e) => handleImageChange(e)}
                    handleCreate={handleCreate}
                    isLoading={isLoading}
                    categoriesCount={initialCategories.length}
                />
            </div>

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
                updatingId={updatingId}
                deletingId={deletingId}
            />
        </div>
    )
}
