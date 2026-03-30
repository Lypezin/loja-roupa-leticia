'use server'

import { requireAdmin } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Cliente com service_role para bypassar RLS nas operações do Admin
function getAdminSupabase() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("⛔ CRÍTICO: SUPABASE_SERVICE_ROLE_KEY ausente. Não é seguro prosseguir operação como anônimo.")
    }
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
}

// Buscar todos os pedidos
export async function getAdminOrders() {
    try {
        await requireAdmin()
        const supabase = getAdminSupabase()

        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    id,
                    quantity,
                    price,
                    products ( name )
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Erro ao buscar pedidos:", error)
            return []
        }

        return orders || []
    } catch (error: any) {
        console.error("Erros no painel Admin (Pedidos):", error.message)
        return []
    }
}

// Atualizar status do pedido
export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await requireAdmin()
        const supabase = getAdminSupabase()

        const { error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId)

        if (error) {
            console.error("Erro DB ao atualizar pedido:", error)
            throw new Error("Não foi possível atualizar o pedido")
        }

        revalidatePath('/admin/pedidos')
    } catch (error: any) {
        console.error("Erro Fatal no Update Status:", error.message)
        throw new Error(error.message || "Erro desconhecido ao atualizar pedido.")
    }
}

// Stats para o Dashboard
export async function getAdminStats() {
    try {
        await requireAdmin()
        const supabase = getAdminSupabase()

        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        // Pedidos do mês e total de vendas
        const { data: monthOrders } = await supabase
            .from('orders')
            .select('total_amount')
            .gte('created_at', firstDayOfMonth)
            .neq('status', 'cancelled')

        const totalSales = monthOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
        const totalOrders = monthOrders?.length || 0

        return { totalSales, totalOrders }
    } catch (error: any) {
        console.error("Erro nas estatisticas do painel Admin:", error.message)
        return { totalSales: 0, totalOrders: 0 }
    }
}

