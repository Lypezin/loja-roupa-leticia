import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, Loader2, PackageCheck, Truck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createShipmentDraft, syncShipment } from "../actions"
import { Order } from "./types"

interface OrderShippingActionsProps {
    order: Order
    canManageMelhorEnvio: boolean
}

export function OrderShippingActions({ order, canManageMelhorEnvio }: OrderShippingActionsProps) {
    const [shippingBusy, setShippingBusy] = useState(false)
    const router = useRouter()

    const handleCreateShipment = async () => {
        try {
            setShippingBusy(true)
            const shipment = await createShipmentDraft(order.id)
            toast.success(`Etiqueta emitida no Melhor Envio${shipment?.protocol ? ` (${shipment.protocol})` : ""}.`)
            router.refresh()
        } catch (error) {
            console.error("Erro ao emitir etiqueta:", error)
            toast.error(error instanceof Error ? error.message : "Não foi possível emitir a etiqueta.")
        } finally {
            setShippingBusy(false)
        }
    }

    const handleSyncShipment = async () => {
        try {
            setShippingBusy(true)
            const shipment = await syncShipment(order.id)
            toast.success(`Envio sincronizado${shipment?.statusDetail ? `: ${shipment.statusDetail}` : "."}`)
            router.refresh()
        } catch (error) {
            console.error("Erro ao sincronizar envio:", error)
            toast.error(error instanceof Error ? error.message : "Não foi possível sincronizar o envio.")
        } finally {
            setShippingBusy(false)
        }
    }

    if (!canManageMelhorEnvio) {
        return (
            <p className="text-xs text-zinc-500">
                Sem ação logística pendente no momento.
            </p>
        )
    }

    return (
        <div className="flex flex-wrap gap-2">
            {!order.shipping_external_id ? (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs"
                    disabled={shippingBusy}
                    onClick={handleCreateShipment}
                >
                    {shippingBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
                    Emitir etiqueta
                </Button>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs"
                    disabled={shippingBusy}
                    onClick={handleSyncShipment}
                >
                    {shippingBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Truck className="h-3.5 w-3.5" />}
                    Sincronizar envio
                </Button>
            )}
            {order.shipping_tracking_url && (
                <a
                    href={order.shipping_tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-zinc-200 px-3 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Rastreio
                </a>
            )}
        </div>
    )
}
