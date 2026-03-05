import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

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

    const footerLinks = {
        loja: [
            { href: "/camisetas", label: "Camisetas" },
            { href: "/calcas", label: "Calças" },
            { href: "/acessorios", label: "Acessórios" },
        ],
        empresa: [
            { href: "/sobre", label: "Sobre Nós" },
            { href: "/contato", label: "Contato" },
            { href: "/termos", label: "Termos de Uso" },
        ],
        atendimento: [
            { href: "/conta", label: "Minha Conta" },
            { href: "/carrinho", label: "Meu Carrinho" },
        ]
    }

    return (
        <footer className="w-full bg-zinc-950 text-zinc-400 mt-0">
            {/* Newsletter Strip */}
            <div className="border-b border-zinc-800">
                <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{newsletterTitle}</h3>
                        <p className="text-sm text-zinc-500">{newsletterSubtitle}</p>
                    </div>
                    <div className="flex w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            className="flex-1 md:w-72 bg-zinc-900 border border-zinc-800 rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                        />
                        <button className="bg-white text-zinc-950 px-6 py-3 rounded-r-xl text-sm font-semibold hover:bg-zinc-100 transition-colors whitespace-nowrap">
                            Inscrever
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="font-bold text-xl tracking-[-0.05em] text-white mb-4 block">
                            {storeName}
                        </Link>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                            {aboutText}
                        </p>
                        <div className="flex gap-3">
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors">
                                    <Instagram className="w-4 h-4 text-zinc-400" />
                                </a>
                            )}
                            {settings?.support_email && (
                                <a href={`mailto:${settings.support_email}`} className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors">
                                    <Mail className="w-4 h-4 text-zinc-400" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Loja</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.loja.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Empresa</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.empresa.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Atendimento</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.atendimento.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-zinc-800">
                <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
                    <span>© {currentYear} {storeName}. Todos os direitos reservados.</span>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span>Todos os sistemas operacionais</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
