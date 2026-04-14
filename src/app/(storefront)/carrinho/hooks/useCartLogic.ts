'use client'

import { useEffect, useState, useSyncExternalStore } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { readCustomerProfile } from "@/lib/customer-profile"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"

export function useCartLogic() {
    const { items, selectedShipping, totalPrice } = useCartStore()
    const [defaultPostalCode, setDefaultPostalCode] = useState<string | null>(null)
    
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    )

    useEffect(() => {
        const supabase = createClient()
        void supabase.auth.getUser().then(({ data }) => {
            const postalCode = readCustomerProfile(data.user)?.shippingAddress?.postal_code ?? null

            if (postalCode) setDefaultPostalCode(postalCode)
        })
    }, [])

    const subtotal = totalPrice()
    const shippingCost = selectedShipping?.cost ?? 0
    const total = Number((subtotal + shippingCost).toFixed(2))

    const handleWhatsAppCheckout = async () => {
        const supabase = createClient()
        const { data: settings } = await supabase.from("store_settings").select("whatsapp_number, store_name").single()
        const cleanPhone = settings?.whatsapp_number?.replace(/\D/g, "") || ""

        if (cleanPhone.length < 10) {
            toast.error("O WhatsApp da loja ainda não está configurado.")
            return
        }

        let message = `*Novo pedido - ${settings?.store_name || "Loja"}*\n\n`
        message += "Olá! Gostaria de finalizar a compra dos seguintes itens:\n\n"

        items.forEach((item, index) => {
            message += `${index + 1}. *${item.product_name}*\n`
            message += `   Qtd: ${item.quantity}\n`
            if (item.color) message += `   Cor: ${item.color}\n`
            if (item.size) message += `   Tam: ${item.size}\n`
            message += `   Preço: ${formatCurrency(item.price)}\n\n`
        })

        if (selectedShipping) {
            message += "*Frete selecionado*\n"
            message += `   ${selectedShipping.company_name} - ${selectedShipping.service_name}\n`
            message += `   Prazo: ${selectedShipping.delivery_days} dia(s) úteis\n`
            message += `   Valor: ${selectedShipping.is_free_shipping ? "Grátis" : formatCurrency(selectedShipping.cost)}\n\n`
        } else {
            message += "*Frete*: ainda não calculado\n\n"
        }

        message += `*Total: ${formatCurrency(total)}*`

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
        window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    }

    return {
        mounted,
        items,
        subtotal,
        shippingCost,
        total,
        selectedShipping,
        defaultPostalCode,
        handleWhatsAppCheckout
    }
}
