import { MessageCircle, RefreshCcw, ShieldCheck, Truck } from "lucide-react"
import type { StoreSettings } from "@/lib/storefront"

const trustIcons = [Truck, ShieldCheck, RefreshCcw, MessageCircle]

export function TrustSection({ settings }: { settings?: StoreSettings | null }) {
    const trustItems = [
        {
            icon: trustIcons[0],
            title: settings?.trust_banner_1_title || "Entrega com rastreio",
            desc: settings?.trust_banner_1_desc || "Consulte prazo e valor antes de pagar.",
        },
        {
            icon: trustIcons[1],
            title: settings?.trust_banner_2_title || "Pagamento protegido",
            desc: settings?.trust_banner_2_desc || "Checkout seguro para Pix e cartão.",
        },
        {
            icon: trustIcons[2],
            title: settings?.trust_banner_3_title || "Troca em até 7 dias",
            desc: settings?.trust_banner_3_desc || "Suporte pelo WhatsApp ou e-mail.",
        },
        {
            icon: trustIcons[3],
            title: settings?.trust_banner_4_title || "Atendimento direto",
            desc: settings?.trust_banner_4_desc || "Resposta em horário comercial.",
        },
    ]

    return (
        <section className="page-shell pb-14 md:pb-18">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {trustItems.map((item, index) => (
                    <div
                        key={item.title}
                        className={`surface-card hover-lift-soft animate-enter-soft rounded-[1.6rem] border border-muted/20 p-5 ${index === 0 ? "" : index === 1 ? "animate-enter-delay-1" : index === 2 ? "animate-enter-delay-2" : "animate-enter-delay-3"}`}
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <item.icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
