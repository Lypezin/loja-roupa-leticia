import { createClient } from "@/lib/supabase/server"
import { Mail, MessageCircle, Instagram, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export const revalidate = 60

export default async function ContatoPage() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('store_settings')
        .select('store_name, support_email, whatsapp_number, instagram_url')
        .single()

    const contacts = [
        {
            icon: Mail,
            title: "E-mail",
            value: settings?.support_email || "contato@fashionstore.com",
            href: `mailto:${settings?.support_email || "contato@fashionstore.com"}`,
            color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
        },
        {
            icon: MessageCircle,
            title: "WhatsApp",
            value: settings?.whatsapp_number || "(00) 00000-0000",
            href: `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || ""}`,
            color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
        },
        {
            icon: Instagram,
            title: "Instagram",
            value: settings?.instagram_url ? `@${settings.instagram_url.split('/').pop()}` : "@fashionstore",
            href: settings?.instagram_url || "#",
            color: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-500/20",
        },
    ]

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
                        Fale Conosco
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Contato</h1>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Estamos aqui para ajudar. Escolha o canal de sua preferência.
                    </p>
                </div>

                <div className="space-y-4">
                    {contacts.map(contact => (
                        <Link
                            key={contact.title}
                            href={contact.href}
                            target="_blank"
                            className="group flex items-center justify-between p-5 rounded-2xl border border-border hover:border-foreground/20 hover:shadow-sm bg-card transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${contact.color}`}>
                                    <contact.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{contact.title}</p>
                                    <p className="text-foreground font-semibold">{contact.value}</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-16 p-8 bg-muted/50 rounded-2xl border border-border">
                    <h3 className="font-semibold text-lg text-foreground mb-2">Horário de Atendimento</h3>
                    <p className="text-muted-foreground text-sm">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-muted-foreground text-sm">Sábado: 9h às 13h</p>
                </div>
            </div>
        </div>
    )
}
