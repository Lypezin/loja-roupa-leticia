'use server'

import { createAbacatePayBilling, getAbacatePayMethods, normalizeAbacatePayStatus } from "@/lib/abacatepay"
import { getCheckoutProfile, normalizeBrazilPhone, normalizeCpf } from "@/lib/customer-profile"
import { parseCheckoutCartItems } from "@/lib/checkout"
import { calculateCheckoutTotal, buildAbacatePayProducts, getValidatedItems, validateCheckoutItems } from "@/lib/payment-checkout"
import { getSiteUrl } from "@/lib/site-url"
import type { Json } from "@/lib/supabase/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"

function getCheckoutRedirectPath(path: string) {
    return encodeURIComponent(path)
}

export async function createCheckoutSession(cartItems: unknown) {
    let externalId: string | null = null

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return {
                redirectTo: `/conta/login?reason=checkout_login_required&next=${getCheckoutRedirectPath('/carrinho')}`,
            }
        }

        const { profile, missingFields } = getCheckoutProfile(user)

        if (!profile || missingFields.length > 0) {
            return {
                redirectTo: `/conta/perfil?reason=checkout_profile_required&next=${getCheckoutRedirectPath('/carrinho')}`,
            }
        }

        const normalizedPhone = normalizeBrazilPhone(profile.phone)
        const normalizedCpf = normalizeCpf(profile.cpf)

        if (!normalizedPhone || !normalizedCpf) {
            return {
                redirectTo: `/conta/perfil?reason=checkout_profile_required&next=${getCheckoutRedirectPath('/carrinho')}`,
            }
        }

        const origin = getSiteUrl()
        const normalizedCartItems = parseCheckoutCartItems(cartItems)
        const productIds = [...new Set(normalizedCartItems.map((item) => item.product_id))]
        const variationIds = [...new Set(normalizedCartItems.map((item) => item.variation_id))]

        const { productsById, variationsById } = await validateCheckoutItems(productIds, variationIds)
        const validatedItems = getValidatedItems(normalizedCartItems, productsById, variationsById)
        const totalAmount = calculateCheckoutTotal(validatedItems)
        const paymentMethods = getAbacatePayMethods()
        const serviceRole = createServiceRoleClient('checkout.create-payment-attempt')

        externalId = `checkout_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`

        const { error: insertAttemptError } = await serviceRole
            .from('payment_attempts')
            .insert({
                provider: 'abacatepay',
                external_id: externalId,
                user_id: user.id,
                trusted_items: validatedItems as unknown as Json,
                total_amount: totalAmount,
                customer_email: profile.email,
                customer_name: profile.fullName,
                customer_phone: normalizedPhone,
                customer_tax_id: normalizedCpf,
                shipping_address: (profile.shippingAddress as Json | null) ?? null,
                status: 'creating',
            })

        if (insertAttemptError) {
            throw new Error(`Falha ao registrar tentativa de pagamento: ${insertAttemptError.message}`)
        }

        try {
            const billing = await createAbacatePayBilling({
                frequency: 'ONE_TIME',
                methods: paymentMethods,
                products: buildAbacatePayProducts(validatedItems),
                returnUrl: `${origin}/carrinho`,
                completionUrl: `${origin}/sucesso?checkout_ref=${externalId}`,
                customer: {
                    name: profile.fullName,
                    cellphone: normalizedPhone,
                    email: profile.email,
                    taxId: normalizedCpf,
                },
                allowCoupons: false,
                externalId,
                metadata: {
                    user_id: user.id,
                    source: 'storefront',
                },
            })

            const { error: updateAttemptError } = await serviceRole
                .from('payment_attempts')
                .update({
                    checkout_id: billing.id,
                    checkout_url: billing.url,
                    status: normalizeAbacatePayStatus(billing.status),
                    payment_method: billing.methods?.join(', ') || paymentMethods.join(', '),
                    receipt_url: billing.receiptUrl || null,
                    raw_response: billing as unknown as Json,
                    updated_at: new Date().toISOString(),
                })
                .eq('external_id', externalId)

            if (updateAttemptError) {
                throw new Error(`Falha ao atualizar tentativa de pagamento: ${updateAttemptError.message}`)
            }

            if (!billing.url) {
                throw new Error('AbacatePay nao retornou a URL de pagamento.')
            }

            return { url: billing.url }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Falha ao iniciar pagamento.'

            await serviceRole
                .from('payment_attempts')
                .update({
                    status: 'failed',
                    raw_response: { error: message } as Json,
                    updated_at: new Date().toISOString(),
                })
                .eq('external_id', externalId)

            if (paymentMethods.includes('CARD')) {
                throw new Error(`${message} Se o cartao nao estiver liberado na sua conta, configure ABACATEPAY_PAYMENT_METHODS=PIX.`)
            }

            throw new Error(message)
        }
    } catch (error) {
        console.error('Erro ao gerar checkout da AbacatePay:', error)
        return { error: error instanceof Error ? error.message : 'Falha ao processar pagamento.' }
    }
}
