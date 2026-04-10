import { SupabaseClient } from '@supabase/supabase-js'

export type AttemptItem = {
    product_name?: string
    size?: string | null
    color?: string | null
    quantity?: number
    unit_price?: number
}

export type OrderItem = {
    id: string
    quantity: number
    price: number
    products?: { name?: string | null } | null
}

export type PaymentAttemptRecord = {
    external_id: string
    status: string
    total_amount: number
    receipt_url: string | null
    payment_method: string | null
    trusted_items: AttemptItem[] | null
    created_at: string
}

export type OrderRecord = {
    id: string
    status: string
    total_amount: number
    payment_method: string | null
    payment_receipt_url: string | null
    order_items: OrderItem[] | null
}

export async function fetchPaymentAttempt(supabase: SupabaseClient, checkoutRef: string, userId: string): Promise<PaymentAttemptRecord | null> {
    const { data } = await supabase
        .from('payment_attempts')
        .select('external_id, status, total_amount, receipt_url, payment_method, trusted_items, created_at')
        .eq('external_id', checkoutRef)
        .eq('user_id', userId)
        .maybeSingle()
    
    return data as PaymentAttemptRecord | null
}

export async function fetchOrderDetails(supabase: SupabaseClient, checkoutRef: string, userId: string): Promise<OrderRecord | null> {
    const { data } = await supabase
        .from('orders')
        .select(`
            id,
            status,
            total_amount,
            payment_method,
            payment_receipt_url,
            order_items (
                id,
                quantity,
                price,
                products ( name )
            )
        `)
        .eq('payment_external_id', checkoutRef)
        .eq('user_id', userId)
        .maybeSingle()
        
    return data as OrderRecord | null
}
