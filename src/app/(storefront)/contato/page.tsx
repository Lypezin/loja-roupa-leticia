import Link from "next/link"
import { ArrowUpRight, Instagram, Mail, MessageCircle } from "lucide-react"
import { getStoreSettings } from "@/lib/storefront"

export const revalidate = 60

function getWhatsAppHref(phone: string | null | undefined) {
    const digits = phone?.replace(/\D/g, "") || ""
    return digits.length >= 10 ? `https://wa.me/${digits}` : null
}

function getInstagramValue(url: string | null | undefined) {
    if (!url) {
        return null
    }

    const handle = url.split("/").filter(Boolean).pop()
    return handle ? `@${handle}` : url
}

export default async function ContatoPage() {
    const settings = await getStoreSettings()

    const contacts = [
        {
            icon: Mail,
            title: "E-mail",
            value: settings?.support_email || null,
            href: settings?.support_email ? `mailto:${settings.support_email}` : null,
        },
        {
            icon: MessageCircle,
            title: "WhatsApp",
            value: settings?.whatsapp_number || null,
            href: getWhatsAppHref(settings?.whatsapp_number),
        },
        {
            icon: Instagram,
            title: "Instagram",
            value: getInstagramValue(settings?.instagram_url),
            href: settings?.instagram_url || null,
        },
    ].filter((contact) => contact.value && contact.href)

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

                {contacts.length > 0 ? (
                    <div className="mt-8 space-y-4">
                        {contacts.map((contact) => (
                            <Link
                                key={contact.title}
                                href={contact.href!}
                                target="_blank"
                                rel="noreferrer"
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
                ) : (
                    <div className="surface-card mt-8 rounded-[1.8rem] p-6 text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">canais em atualização</p>
                        <p className="mt-3 text-sm leading-7 text-foreground">
                            Estamos ajustando os contatos públicos da loja. Enquanto isso, fale com a gente pelas redes oficiais da marca.
                        </p>
                    </div>
                )}

                <div className="surface-card mt-8 rounded-[1.8rem] p-6 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Horário de atendimento</p>
                    <p className="mt-3 text-sm leading-7 text-foreground">Segunda a sexta, das 9h às 18h.</p>
                    <p className="text-sm leading-7 text-muted-foreground">Sábado, das 9h às 13h.</p>
                </div>
            </div>
        </div>
    )
}
