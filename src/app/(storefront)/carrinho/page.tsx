'use client'

import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useEffect, useState, useSyncExternalStore } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { normalizePostalCode } from "@/lib/customer-profile"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"
import { CartItem } from "./components/CartItem"
import { CartSummary } from "./components/CartSummary"

export default function CarrinhoPage() {
    const { items, removeItem, updateQuantity, totalPrice, selectedShipping } = useCartStore()
    const [defaultPostalCode, setDefaultPostalCode] = useState<string | null>(null)
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    )
    const subtotal = totalPrice()
    const shippingCost = selectedShipping?.cost ?? 0
    const total = Number((subtotal + shippingCost).toFixed(2))

    useEffect(() => {
        const supabase = createClient()

        void supabase.auth.getUser().then(({ data }) => {
            const metadata = data.user?.user_metadata

            if (!metadata || typeof metadata !== "object") {
                return
            }

            const postalCode = typeof metadata.postal_code === "string"
                ? normalizePostalCode(metadata.postal_code)
                : null

            if (postalCode) {
                setDefaultPostalCode(postalCode)
            }
        })
    }, [])

    const handleWhatsAppCheckout = async () => {
        const supabase = createClient()
        const { data: settings } = await supabase.from("store_settings").select("whatsapp_number, store_name").single()

        const cleanPhone = settings?.whatsapp_number?.replace(/\D/g, "") || ""

        if (cleanPhone.length < 10) {
            toast.error("O WhatsApp da loja ainda nao esta configurado.")
            return
        }

        let message = `*Novo pedido - ${settings?.store_name || "Loja"}*\n\n`
        message += "Ola! Gostaria de finalizar a compra dos seguintes itens:\n\n"

        items.forEach((item, index) => {
            message += `${index + 1}. *${item.product_name}*\n`
            message += `   Qtd: ${item.quantity}\n`
            if (item.color) {
                message += `   Cor: ${item.color}\n`
            }
            if (item.size) {
                message += `   Tam: ${item.size}\n`
            }
            message += `   Preco: ${formatCurrency(item.price)}\n\n`
        })

        if (selectedShipping) {
            message += "*Frete selecionado*\n"
            message += `   ${selectedShipping.company_name} - ${selectedShipping.service_name}\n`
            message += `   Prazo: ${selectedShipping.delivery_days} dia(s) uteis\n`
            message += `   Valor: ${selectedShipping.is_free_shipping ? "Gratis" : formatCurrency(selectedShipping.cost)}\n\n`
        } else {
            message += "*Frete*: ainda nao calculado\n\n"
        }

        message += `*Total: ${formatCurrency(total)}*`

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
        window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    }

    if (!mounted) {
        return (
            <div className="page-shell py-20">
                <div className="flex h-96 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="page-shell py-20">
                <div className="paper-panel mx-auto max-w-xl rounded-[2rem] px-6 py-10 text-center md:px-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                        <ShoppingBag className="h-7 w-7" />
                    </div>
                    <h1 className="mt-6 font-display text-4xl text-foreground">Sua sacola esta vazia</h1>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Volte para a loja e escolha os itens que deseja adicionar.
                    </p>
                    <Link href="/" className="mt-7 inline-flex">
                        <Button className="gap-2 rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para a loja
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const formattedSubtotal = formatCurrency(subtotal)
    const formattedShipping = !selectedShipping
        ? "Calcular"
        : selectedShipping.is_free_shipping
            ? "Gratis"
            : formatCurrency(shippingCost)
    const formattedTotal = formatCurrency(total)
    const installment = formatCurrency(total / 3)

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <span className="eyebrow">sacola</span>
                <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Seu carrinho</h1>
                <p className="mt-3 text-sm text-muted-foreground">{items.length} {items.length === 1 ? "item" : "itens"} selecionado(s)</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            removeItem={removeItem}
                            updateQuantity={updateQuantity}
                        />
                    ))}
                </div>

                <CartSummary
                    formattedSubtotal={formattedSubtotal}
                    formattedShipping={formattedShipping}
                    formattedTotal={formattedTotal}
                    installment={installment}
                    defaultPostalCode={defaultPostalCode}
                    handleWhatsAppCheckout={handleWhatsAppCheckout}
                />
            </div>
        </div>
    )
}
