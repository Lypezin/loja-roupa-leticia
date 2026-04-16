'use server'

import type { Json } from "@/lib/supabase/database.types"
import { createAbacatePayBilling, getAbacatePayMethods, normalizeAbacatePayStatus } from "@/lib/abacatepay"
import { parseCheckoutCartItems } from "@/lib/checkout"
import { getCheckoutProfile, normalizeBrazilPhone, normalizeCpf } from "@/lib/customer-profile"
import { buildAbacatePayBillingProducts, calculateCheckoutTotal, getValidatedItems, validateCheckoutItems } from "@/lib/payment-checkout"
import { buildIpAndUserIdentifiers, enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit"
import { getServerActionSecurityContext } from "@/lib/security/request-context"
import { getSiteUrl } from "@/lib/site-url"
import { getShippingChargedAmount, resolveCheckoutShippingSelection } from "@/lib/store-shipping"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { createClient } from "@/lib/supabase/server"
import type { CheckoutShippingSelection } from "@/types/shipping"

function getCheckoutRedirectPath(path: string) {
    return encodeURIComponent(path)
}

export async function createCheckoutSession(cartItems: unknown, shippingSelection?: CheckoutShippingSelection | null) {
    let externalId: string | null = null

    try {
        const supabase = await createClient()
        const securityContext = await getServerActionSecurityContext()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return {
                redirectTo: `/conta/login?reason=checkout_login_required&next=${getCheckoutRedirectPath("/carrinho")}`,
            }
        }

        const { profile, missingFields } = getCheckoutProfile(user)

        if (!profile || missingFields.length > 0) {
            return {
                redirectTo: `/conta/perfil?reason=checkout_profile_required&next=${getCheckoutRedirectPath("/carrinho")}`,
            }
        }

        const normalizedPhone = normalizeBrazilPhone(profile.phone)
        const normalizedCpf = normalizeCpf(profile.cpf)

        if (!normalizedPhone || !normalizedCpf || !profile.shippingAddress) {
            return {
                redirectTo: `/conta/perfil?reason=checkout_profile_required&next=${getCheckoutRedirectPath("/carrinho")}`,
            }
        }

        await enforceRateLimit({
            scope: "checkout:create-session",
            maxAttempts: 6,
            windowSeconds: 60 * 5,
            blockSeconds: 60 * 10,
            identifiers: buildIpAndUserIdentifiers(securityContext, user.id, profile.email),
        })

        const shippingAddress = profile.shippingAddress
        const destinationPostalCode = shippingSelection?.postal_code || shippingAddress.postal_code
        const origin = getSiteUrl()
        const normalizedCartItems = parseCheckoutCartItems(cartItems)
        const productIds = [...new Set(normalizedCartItems.map((item) => item.product_id))]
        const variationIds = [...new Set(normalizedCartItems.map((item) => item.variation_id))]

        const { productsById, variationsById } = await validateCheckoutItems(productIds, variationIds)
        const validatedItems = getValidatedItems(normalizedCartItems, productsById, variationsById)
        const selectedShipping = await resolveCheckoutShippingSelection(
            normalizedCartItems,
            destinationPostalCode,
            shippingSelection,
        )
        const effectiveShippingAddress = {
            ...shippingAddress,
            postal_code: selectedShipping.postal_code || shippingAddress.postal_code,
        }
        const shippingCost = getShippingChargedAmount(selectedShipping)
        const totalAmount = calculateCheckoutTotal(validatedItems, shippingCost)
        const paymentMethods = getAbacatePayMethods()
        const serviceRole = createServiceRoleClient("checkout.create-payment-attempt")

        externalId = `checkout_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`

        const { error: insertAttemptError } = await serviceRole
            .from("payment_attempts")
            .insert({
                provider: "abacatepay",
                external_id: externalId,
                user_id: user.id,
                trusted_items: validatedItems as unknown as Json,
                total_amount: totalAmount,
                customer_email: profile.email,
                customer_name: profile.fullName,
                customer_phone: normalizedPhone,
                customer_tax_id: normalizedCpf,
                shipping_address: (effectiveShippingAddress as Json | null) ?? null,
                shipping_provider: selectedShipping.provider,
                shipping_service_id: selectedShipping.service_id,
                shipping_service_name: selectedShipping.service_name,
                shipping_company_name: selectedShipping.company_name,
                shipping_cost: shippingCost,
                shipping_provider_cost: selectedShipping.provider_cost,
                shipping_delivery_days: selectedShipping.delivery_days,
                shipping_quote_payload: (selectedShipping.quote_payload as Json | null) ?? null,
                status: "creating",
            })

        if (insertAttemptError) {
            throw new Error(`Falha ao registrar tentativa de pagamento: ${insertAttemptError.message}`)
        }

        try {
            const billing = await createAbacatePayBilling({
                frequency: "ONE_TIME",
                methods: paymentMethods,
                products: buildAbacatePayBillingProducts(validatedItems, selectedShipping),
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
                metadata: { user_id: user.id, source: "storefront" },
            })

            const { error: updateAttemptError } = await serviceRole
                .from("payment_attempts")
                .update({
                    checkout_id: billing.id,
                    checkout_url: billing.url,
                    status: normalizeAbacatePayStatus(billing.status),
                    payment_method: billing.methods?.join(", ") || paymentMethods.join(", "),
                    receipt_url: billing.receiptUrl || null,
                    raw_response: billing as unknown as Json,
                    updated_at: new Date().toISOString(),
                })
                .eq("external_id", externalId)

            if (updateAttemptError) {
                throw new Error(`Falha ao atualizar tentativa de pagamento: ${updateAttemptError.message}`)
            }

            if (!billing.url) {
                throw new Error("A AbacatePay nao retornou a URL de pagamento.")
            }

            return { url: billing.url }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Falha ao iniciar pagamento."

            await serviceRole
                .from("payment_attempts")
                .update({
                    status: "failed",
                    raw_response: { error: message } as Json,
                    updated_at: new Date().toISOString(),
                })
                .eq("external_id", externalId)

            throw new Error("Nao foi possivel iniciar o pagamento. Tente novamente.")
        }
    } catch (error: unknown) {
        if (error instanceof RateLimitError) {
            return { error: error.message }
        }

        console.error("Erro ao gerar checkout da AbacatePay:", error)
        return { error: error instanceof Error ? error.message : "Falha ao processar pagamento." }
    }
}
