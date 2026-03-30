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

    return orders
}

// Atualizar status do pedido
export async function updateOrderStatus(orderId: string, status: string) {
    await requireAdmin()
    const supabase = getAdminSupabase()

    const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)

    if (error) {
        console.error("Erro ao atualizar pedido:", error)
        throw new Error("Não foi possível atualizar o pedido")
    }

    revalidatePath('/admin/pedidos')
}

// Stats para o Dashboard
export async function getAdminStats() {
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
}
