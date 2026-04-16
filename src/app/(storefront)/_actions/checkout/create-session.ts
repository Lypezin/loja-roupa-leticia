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
import type { ValidatedCheckoutItem } from "@/types/checkout"

type CheckoutChannel = "storefront" | "whatsapp"

type CheckoutActionResult = {
    url?: string
    whatsappUrl?: string
    redirectTo?: string
    error?: string
}

type StoreContactSettings = {
    store_name: string | null
    whatsapp_number: string | null
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

function getCheckoutRedirectPath(path: string) {
    return encodeURIComponent(path)
}

function formatCurrency(value: number) {
    return currencyFormatter.format(value)
}

function normalizeWhatsAppNumber(value: string | null | undefined) {
    const normalized = value ? normalizeBrazilPhone(value) : null
    return normalized?.replace(/^\+/, "") ?? null
}

function buildWhatsAppCheckoutMessage(params: {
    storeName: string
    externalId: string
    checkoutUrl: string
    items: ValidatedCheckoutItem[]
    totalAmount: number
    shippingSelection: Awaited<ReturnType<typeof resolveCheckoutShippingSelection>>
}) {
    const messageLines = [
        `*Checkout assistido - ${params.storeName}*`,
        "",
        "Ola! Quero concluir este pedido pelo WhatsApp.",
        "",
        `*Referencia:* ${params.externalId}`,
        "",
        "*Itens confirmados*",
    ]

    params.items.forEach((item, index) => {
        messageLines.push(`${index + 1}. *${item.product_name}*`)
        messageLines.push(`   Qtd: ${item.quantity}`)

        if (item.color) {
            messageLines.push(`   Cor: ${item.color}`)
        }

        if (item.size) {
            messageLines.push(`   Tam: ${item.size}`)
        }

        messageLines.push(`   Valor: ${formatCurrency(item.unit_price * item.quantity)}`)
        messageLines.push("")
    })

    messageLines.push("*Frete selecionado*")
    messageLines.push(`   ${params.shippingSelection.company_name} - ${params.shippingSelection.service_name}`)
    messageLines.push(`   Prazo: ${params.shippingSelection.delivery_days} dia(s) uteis`)
    messageLines.push(
        `   Valor: ${params.shippingSelection.is_free_shipping ? "Gratis" : formatCurrency(params.shippingSelection.cost)}`,
    )
    messageLines.push("")
    messageLines.push(`*Total para pagamento:* ${formatCurrency(params.totalAmount)}`)
    messageLines.push(`*Link de pagamento:* ${params.checkoutUrl}`)
    messageLines.push("")
    messageLines.push("Assim que o pagamento for confirmado, o pedido entra na loja, o estoque e baixado e o envio segue com esse frete.")

    return messageLines.join("\n")
}

async function getStoreContactSettings(serviceRole: ReturnType<typeof createServiceRoleClient>) {
    const { data, error } = await serviceRole
        .from("store_settings")
        .select("store_name, whatsapp_number")
        .limit(1)
        .maybeSingle<StoreContactSettings>()

    if (error) {
        throw new Error(`Falha ao carregar configuracoes da loja: ${error.message}`)
    }

    return data ?? null
}

async function prepareCheckoutSession(
    cartItems: unknown,
    shippingSelection?: CheckoutShippingSelection | null,
    channel: CheckoutChannel = "storefront",
): Promise<CheckoutActionResult> {
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

        const serviceRole = createServiceRoleClient(`checkout.prepare-payment-attempt.${channel}`)
        const storeContactSettings = channel === "whatsapp"
            ? await getStoreContactSettings(serviceRole)
            : null
        const cleanWhatsAppNumber = normalizeWhatsAppNumber(storeContactSettings?.whatsapp_number)

        if (channel === "whatsapp" && !cleanWhatsAppNumber) {
            return { error: "O WhatsApp da loja ainda nao esta configurado corretamente." }
        }

        await enforceRateLimit({
            scope: "checkout:create-payment-attempt",
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
                metadata: { user_id: user.id, source: channel },
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

            if (channel === "whatsapp") {
                const checkoutMessage = buildWhatsAppCheckoutMessage({
                    storeName: storeContactSettings?.store_name || "Loja",
                    externalId,
                    checkoutUrl: billing.url,
                    items: validatedItems,
                    totalAmount,
                    shippingSelection: selectedShipping,
                })

                return {
                    whatsappUrl: `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(checkoutMessage)}`,
                }
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

export async function createCheckoutSession(cartItems: unknown, shippingSelection?: CheckoutShippingSelection | null) {
    return prepareCheckoutSession(cartItems, shippingSelection, "storefront")
}

export async function createWhatsAppCheckoutSession(cartItems: unknown, shippingSelection?: CheckoutShippingSelection | null) {
    return prepareCheckoutSession(cartItems, shippingSelection, "whatsapp")
}
