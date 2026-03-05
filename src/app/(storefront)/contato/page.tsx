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
            color: "bg-blue-50 text-blue-600 border-blue-100",
        },
        {
            icon: MessageCircle,
            title: "WhatsApp",
            value: settings?.whatsapp_number || "(00) 00000-0000",
            href: `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || ""}`,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
        },
        {
            icon: Instagram,
            title: "Instagram",
            value: settings?.instagram_url ? `@${settings.instagram_url.split('/').pop()}` : "@fashionstore",
            href: settings?.instagram_url || "#",
            color: "bg-pink-50 text-pink-600 border-pink-100",
        },
    ]

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-3 block">
                        Fale Conosco
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contato</h1>
                    <p className="text-zinc-500 text-lg max-w-md mx-auto">
                        Estamos aqui para ajudar. Escolha o canal de sua preferência.
                    </p>
                </div>

                <div className="space-y-4">
                    {contacts.map(contact => (
                        <Link
                            key={contact.title}
                            href={contact.href}
                            target="_blank"
                            className="group flex items-center justify-between p-5 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm bg-white transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${contact.color}`}>
                                    <contact.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">{contact.title}</p>
                                    <p className="text-zinc-900 font-semibold">{contact.value}</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-16 p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <h3 className="font-semibold text-lg mb-2">Horário de Atendimento</h3>
                    <p className="text-zinc-500 text-sm">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-zinc-500 text-sm">Sábado: 9h às 13h</p>
                </div>
            </div>
        </div>
    )
}
