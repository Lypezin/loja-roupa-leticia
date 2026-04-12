'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "../actions"

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await deleteProduct(productId)
            if (res?.error) {
                toast.error(res.error)
                return
            }

            toast.success("Produto excluído com sucesso.")
            setOpen(false)
            router.refresh()
        } catch {
            toast.error("Erro ao excluir produto.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                disabled={isDeleting}
                className="h-10 w-10 rounded-2xl border border-transparent text-red-500 hover:border-red-100 hover:bg-red-50 hover:text-red-700"
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>

            <AdminConfirmDialog
                open={open}
                onOpenChange={setOpen}
                title="Excluir produto"
                description={`Tem certeza que deseja excluir "${productName}"? Esta ação remove imagens, variações e não pode ser desfeita.`}
                confirmLabel="Excluir produto"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </>
    )
}
