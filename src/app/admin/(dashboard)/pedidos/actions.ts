'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Função para buscar os pedidos do painel admin
export async function getAdminOrders() {
    await requireAdmin()
    const supabase = await createClient()

    // Buscamos os pedidos mais recentes
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

// Função para atualizar o status do pedido
export async function updateOrderStatus(orderId: string, status: string) {
    await requireAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        console.error("Erro ao atualizar pedido:", error)
        throw new Error("Não foi possível atualizar o pedido")
    }

    revalidatePath('/admin/pedidos')
}
