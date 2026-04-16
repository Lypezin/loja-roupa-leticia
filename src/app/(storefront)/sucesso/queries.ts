import { SupabaseClient } from '@supabase/supabase-js'
import { hashCheckoutAccessToken } from "@/lib/payment-attempts"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

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

export async function fetchPublicPaymentAttempt(checkoutRef: string, accessToken: string): Promise<PaymentAttemptRecord | null> {
    const serviceRole = createServiceRoleClient("checkout-public-access.fetch-attempt")
    const { data } = await serviceRole
        .from('payment_attempts')
        .select('external_id, status, total_amount, receipt_url, payment_method, trusted_items, created_at')
        .eq('external_id', checkoutRef)
        .eq('public_access_token_hash', hashCheckoutAccessToken(accessToken))
        .maybeSingle()

    return data as PaymentAttemptRecord | null
}

export async function fetchPublicOrderDetails(checkoutRef: string): Promise<OrderRecord | null> {
    const serviceRole = createServiceRoleClient("checkout-public-access.fetch-order")
    const { data } = await serviceRole
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
        .maybeSingle()

    return data as OrderRecord | null
}
