'use server'

import { isOrderStatus } from '@/lib/orders'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && error.message) {
        return error.message
    }

    return fallback
}

// Cliente com service_role para bypassar RLS nas operacoes do Admin.
function getAdminSupabase(context: string) {
    return createServiceRoleClient(context)
}

// Buscar todos os pedidos.
export async function getAdminOrders() {
    try {
        await requireAdmin()
        const supabase = getAdminSupabase('admin-orders.list')

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
            console.error('Erro ao buscar pedidos:', error)
            return []
        }

        return orders || []
    } catch (error: unknown) {
        console.error('Erros no painel Admin (Pedidos):', getErrorMessage(error, 'Falha ao listar pedidos.'))
        return []
    }
}

// Atualizar status do pedido.
export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await requireAdmin()
        if (!isOrderStatus(status)) {
            throw new Error('Status de pedido invalido.')
        }

        const supabase = getAdminSupabase('admin-orders.update-status')

        const { error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId)

        if (error) {
            console.error('Erro DB ao atualizar pedido:', error)
            throw new Error('Nao foi possivel atualizar o pedido')
        }

        revalidatePath('/admin/pedidos')
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Erro desconhecido ao atualizar pedido.')
        console.error('Erro Fatal no Update Status:', message)
        throw new Error(message)
    }
}

// Stats para o dashboard.
export async function getAdminStats() {
    try {
        await requireAdmin()
        const supabase = getAdminSupabase('admin-orders.stats')

        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        const { data: monthOrders } = await supabase
            .from('orders')
            .select('total_amount')
            .gte('created_at', firstDayOfMonth)
            .neq('status', 'cancelled')
            .neq('status', 'refunded')

        const totalSales = monthOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
        const totalOrders = monthOrders?.length || 0

        return { totalSales, totalOrders }
    } catch (error: unknown) {
        console.error('Erro nas estatisticas do painel Admin:', getErrorMessage(error, 'Falha ao carregar estatisticas.'))
        return { totalSales: 0, totalOrders: 0 }
    }
}
