import Link from "next/link"
import { ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react"
import { getStoreSettings } from "@/lib/storefront"

export const revalidate = 60

export default async function ContatoPage() {
    const settings = await getStoreSettings()

    const contacts = [
        {
            icon: Mail,
            title: "E-mail",
            value: settings?.support_email || "contato@fashionstore.com",
            href: `mailto:${settings?.support_email || "contato@fashionstore.com"}`,
        },
        {
            icon: MessageCircle,
            title: "WhatsApp",
            value: settings?.whatsapp_number || "(00) 00000-0000",
            href: `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || ""}`,
        },
        {
            icon: Instagram,
            title: "Instagram",
            value: settings?.instagram_url ? `@${settings.instagram_url.split('/').pop()}` : "@fashionstore",
            href: settings?.instagram_url || "#",
        },
    ]

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="mx-auto max-w-3xl">
                <div className="paper-panel rounded-[2rem] px-6 py-8 text-center md:px-8">
                    <span className="eyebrow justify-center">fale com a gente</span>
                    <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Contato</h1>
                    <p className="mx-auto mt-3 max-w-xl text-base leading-8 text-muted-foreground">
                        Atendimento direto, linguagem simples e canais onde a conversa continua humana.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    {contacts.map((contact) => (
                        <Link
                            key={contact.title}
                            href={contact.href}
                            target="_blank"
                            className="surface-card group flex items-center justify-between rounded-[1.6rem] p-5 transition-transform hover:-translate-y-0.5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <contact.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{contact.title}</p>
                                    <p className="mt-1 text-base font-medium text-foreground">{contact.value}</p>
                                </div>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                        </Link>
                    ))}
                </div>

                <div className="surface-card mt-8 rounded-[1.8rem] p-6 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Horario de atendimento</p>
                    <p className="mt-3 text-sm leading-7 text-foreground">Segunda a sexta, das 9h as 18h.</p>
                    <p className="text-sm leading-7 text-muted-foreground">Sabado, das 9h as 13h.</p>
                </div>
            </div>
        </div>
    )
}
