import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { FooterNewsletter } from "./FooterNewsletter"
import { FooterLinksSection } from "./FooterLinksSection"

export async function Footer() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('store_settings')
        .select('store_name, footer_about_text, footer_newsletter_title, footer_newsletter_subtitle, instagram_url, support_email')
        .single()

    const currentYear = new Date().getFullYear()
    const storeName = settings?.store_name || 'FASHION STORE'
    const aboutText = settings?.footer_about_text || 'Peças exclusivas com qualidade premium. Fazemos moda que conta histórias.'
    const newsletterTitle = settings?.footer_newsletter_title || 'Fique por dentro'
    const newsletterSubtitle = settings?.footer_newsletter_subtitle || 'Receba novidades e ofertas exclusivas.'

    const sections = [
        { title: "Loja", links: [{ href: "/camisetas", label: "Camisetas" }, { href: "/calcas", label: "Calças" }, { href: "/acessorios", label: "Acessórios" }] },
        { title: "Empresa", links: [{ href: "/sobre", label: "Sobre Nós" }, { href: "/contato", label: "Contato" }, { href: "/termos", label: "Termos de Uso" }] },
        { title: "Atendimento", links: [{ href: "/conta", label: "Minha Conta" }, { href: "/carrinho", label: "Meu Carrinho" }] }
    ]

    return (
        <footer className="w-full bg-zinc-950 text-zinc-400 mt-0">
            <FooterNewsletter title={newsletterTitle} subtitle={newsletterSubtitle} />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="font-bold text-xl tracking-[-0.05em] text-white mb-4 block">{storeName}</Link>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-6">{aboutText}</p>
                        <div className="flex gap-3">
                            {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"><Instagram className="w-4 h-4 text-zinc-400" /></a>}
                            {settings?.support_email && <a href={`mailto:${settings.support_email}`} className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"><Mail className="w-4 h-4 text-zinc-400" /></a>}
                        </div>
                    </div>
                    {sections.map(s => <FooterLinksSection key={s.title} title={s.title} links={s.links} />)}
                </div>
            </div>

            <div className="border-t border-zinc-800">
                <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
                    <span>© {currentYear} {storeName}. Todos os direitos reservados.</span>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span>Todos os sistemas operacionais</span></div>
                </div>
            </div>
        </footer>
    )
}
