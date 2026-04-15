'use server'

import { createMelhorEnvioShipmentDraft, syncMelhorEnvioShipment } from "@/lib/melhor-envio"
import { revalidatePath } from "next/cache"
import { isOrderStatus } from "@/lib/orders"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdmin } from "@/lib/supabase/server"

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return fallback
}

function getAdminSupabase(context: string) {
    return createServiceRoleClient(context)
}

export async function getAdminOrders() {
    try {
        await requireAdmin()
        const supabase = getAdminSupabase("admin-orders.list")

        const { data: orders, error } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    id,
                    quantity,
                    price,
                    products ( name )
                )
            `)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Erro ao buscar pedidos:", error)
            return []
        }

        return orders || []
    } catch (error: unknown) {
        console.error("Erros no painel Admin (Pedidos):", getErrorMessage(error, "Falha ao listar pedidos."))
        return []
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await requireAdmin()
        if (!isOrderStatus(status)) {
            throw new Error("Status de pedido inválido.")
        }

        const supabase = getAdminSupabase("admin-orders.update-status")

        const { error } = await supabase
            .from("orders")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", orderId)

        if (error) {
            console.error("Erro DB ao atualizar pedido:", error)
            throw new Error("Não foi possível atualizar o pedido.")
        }

        revalidatePath("/admin/pedidos")
    } catch (error: unknown) {
        const message = getErrorMessage(error, "Erro desconhecido ao atualizar pedido.")
        console.error("Erro fatal no update status:", message)
        throw new Error(message)
    }
}

export async function createShipmentDraft(orderId: string) {
    try {
        await requireAdmin()
        const shipment = await createMelhorEnvioShipmentDraft(orderId)
        revalidatePath('/admin/pedidos')
        revalidatePath(`/conta/pedidos/${orderId}`)
        return shipment
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Falha ao criar etiqueta no Melhor Envio.')
        console.error('Erro ao criar etiqueta do Melhor Envio:', message)
        throw new Error(message)
    }
}

export async function syncShipment(orderId: string) {
    try {
        await requireAdmin()
        const shipment = await syncMelhorEnvioShipment(orderId)
        revalidatePath('/admin/pedidos')
        revalidatePath(`/conta/pedidos/${orderId}`)
        return shipment
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Falha ao sincronizar o envio no Melhor Envio.')
        console.error('Erro ao sincronizar envio do Melhor Envio:', message)
        throw new Error(message)
    }
}

export async function getAdminStats() {
    try {
        await requireAdmin()
        const supabase = getAdminSupabase("admin-orders.stats")

        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        const { data: monthOrders } = await supabase
            .from("orders")
            .select("total_amount")
            .gte("created_at", firstDayOfMonth)
            .neq("status", "cancelled")
            .neq("status", "disputed")
            .neq("status", "refunded")

        const totalSales = monthOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
        const totalOrders = monthOrders?.length || 0

        return { totalSales, totalOrders }
    } catch (error: unknown) {
        console.error("Erro nas estatísticas do painel Admin:", getErrorMessage(error, "Falha ao carregar estatísticas."))
        return { totalSales: 0, totalOrders: 0 }
    }
}
