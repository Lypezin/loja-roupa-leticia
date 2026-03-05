import { createClient } from "@/lib/supabase/server"
import { Mail, Phone, Instagram } from "lucide-react"

export const revalidate = 60

export default async function ContatoPage() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('store_settings')
        .select('store_name, support_email, whatsapp_number, instagram_url')
        .single()

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Contato</h1>
            <p className="text-zinc-500 mb-10">Estamos aqui para ajudar. Entre em contato conosco.</p>

            <div className="grid gap-4">
                {settings?.support_email && (
                    <a href={`mailto:${settings.support_email}`} className="flex items-center gap-4 bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-zinc-100 rounded-lg">
                            <Mail className="w-6 h-6 text-zinc-600" />
                        </div>
                        <div>
                            <p className="font-semibold">E-mail</p>
                            <p className="text-sm text-zinc-500">{settings.support_email}</p>
                        </div>
                    </a>
                )}

                {settings?.whatsapp_number && (
                    <a href={`https://wa.me/55${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="font-semibold">WhatsApp</p>
                            <p className="text-sm text-zinc-500">({settings.whatsapp_number.slice(0, 2)}) {settings.whatsapp_number.slice(2)}</p>
                        </div>
                    </a>
                )}

                {settings?.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-pink-50 rounded-lg">
                            <Instagram className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                            <p className="font-semibold">Instagram</p>
                            <p className="text-sm text-zinc-500">Siga-nos no Instagram</p>
                        </div>
                    </a>
                )}

                {!settings?.support_email && !settings?.whatsapp_number && !settings?.instagram_url && (
                    <div className="py-12 text-center text-zinc-500">
                        Os canais de contato ainda não foram configurados. Acesse o painel administrativo para adicioná-los.
                    </div>
                )}
            </div>
        </div>
    )
}
