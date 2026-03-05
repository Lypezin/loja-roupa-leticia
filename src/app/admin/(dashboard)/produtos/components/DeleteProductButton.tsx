'use client'

import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "../actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir "${productName}"? Esta ação não pode ser desfeita.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await deleteProduct(productId)
            if (res?.error) {
                alert(`Erro ao excluir: ${res.error}`)
            } else {
                router.refresh()
            }
        } catch {
            alert('Erro ao excluir produto.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
