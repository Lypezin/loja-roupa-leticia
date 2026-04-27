import type { Json } from '@/lib/supabase/database.types'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function findPaymentAttempt(externalId: string | null, checkoutId: string | null) {
    const supabase = createServiceRoleClient('abacatepay-webhook.find-attempt')

    if (externalId) {
        const { data } = await supabase.from('payment_attempts').select('*').eq('external_id', externalId).maybeSingle()
        if (data) return data
    }

    if (checkoutId) {
        const { data } = await supabase.from('payment_attempts').select('*').eq('checkout_id', checkoutId).maybeSingle()
        if (data) return data
    }

    return null
}

export async function markAttemptStatus(attemptId: string, values: Record<string, Json | string | null>) {
    const supabase = createServiceRoleClient('abacatepay-webhook.mark-attempt')
    const { error } = await supabase
        .from('payment_attempts')
        .update({
            ...values,
            updated_at: new Date().toISOString(),
        })
        .eq('id', attemptId)

    if (error) {
        throw new Error(`Falha ao atualizar tentativa de pagamento: ${error.message}`)
    }
}

export async function markOrderStatus(
    externalId: string | null,
    checkoutId: string | null,
    status: 'refunded' | 'cancelled' | 'disputed',
    paymentRawStatus: string | null,
    receiptUrl: string | null,
    transactionId?: string | null,
) {
    const supabase = createServiceRoleClient('abacatepay-webhook.mark-order')
    let order: { id: string; status: string | null } | null = null

    if (externalId) {
        const { data } = await supabase.from('orders').select('id, status').eq('payment_provider', 'abacatepay').eq('payment_external_id', externalId).maybeSingle()
        order = data || null
    }

    if (!order && checkoutId) {
        const { data } = await supabase.from('orders').select('id, status').eq('payment_provider', 'abacatepay').eq('payment_checkout_id', checkoutId).maybeSingle()
        order = data || null
    }

    if (!order) return

    if (status === 'cancelled' && ['paid', 'processing', 'shipped', 'delivered', 'refunded', 'disputed'].includes(order.status || '')) {
        return
    }

    const { error } = await supabase
        .from('orders')
        .update({
            status,
            payment_raw_status: paymentRawStatus,
            payment_receipt_url: receiptUrl,
            payment_transaction_id: transactionId,
            updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)

    if (error) throw new Error(`Falha ao atualizar pedido: ${error.message}`)
}

export async function finalizePaymentOrder(
    checkoutId: string, externalId: string, 
    userId: string, totalAmount: number, 
    customerEmail: string, customerName: string, 
    shippingAddress: Json, items: Json, 
    checkoutSource: string,
    paymentMethod: string, receiptUrl: string, 
    rawStatus: string,
    transactionId: string,
) {
    const supabase = createServiceRoleClient('abacatepay-webhook.complete')
    const { data, error } = await supabase.rpc('finalize_payment_order', {
        p_provider: 'abacatepay',
        p_checkout_id: checkoutId,
        p_external_id: externalId,
        p_transaction_id: transactionId,
        p_user_id: userId,
        p_total_amount: totalAmount,
        p_customer_email: customerEmail,
        p_customer_name: customerName,
        p_shipping_address: shippingAddress,
        p_items: items,
        p_checkout_source: checkoutSource,
        p_payment_method: paymentMethod,
        p_payment_receipt_url: receiptUrl,
        p_payment_raw_status: rawStatus,
    })

    if (error) throw new Error(error.message)
    return data
}
