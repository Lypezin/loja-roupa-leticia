import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "../actions"
import { Order, STATUS_OPTIONS } from "./types"

interface OrderStatusDialogProps {
    order: Order
    clientName: string
}

export function OrderStatusDialog({ order, clientName }: OrderStatusDialogProps) {
    const [updating, setUpdating] = useState(false)
    const [nextStatus, setNextStatus] = useState(order.status)
    const router = useRouter()

    const handleStatusChange = async () => {
        try {
            setUpdating(true)
            await updateOrderStatus(order.id, nextStatus)
            toast.success("Status do pedido atualizado.")
            router.refresh()
        } catch (error) {
            console.error("Erro ao alterar status:", error)
            toast.error("Não foi possível atualizar o status do pedido.")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="h-8 rounded-full px-3 text-xs">
                    Ajustar exceção
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajustar status manualmente</DialogTitle>
                    <DialogDescription>
                        Use isso só para exceções operacionais, como disputa, cancelamento, reembolso ou correção após falha externa.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                        <p className="font-medium text-zinc-900">{clientName}</p>
                        <p>{order.id}</p>
                    </div>

                    <Select value={nextStatus} onValueChange={setNextStatus} disabled={updating}>
                        <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button type="button" onClick={handleStatusChange} disabled={updating || nextStatus === order.status}>
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Salvar ajuste
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
