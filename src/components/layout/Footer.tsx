import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { FooterNewsletter } from "./FooterNewsletter"
import { FooterLinksSection } from "./FooterLinksSection"

export async function Footer() {
    const supabase = await createClient()

    const [{ data: settings }, { data: categories }] = await Promise.all([
        supabase
            .from("store_settings")
            .select("store_name, footer_about_text, footer_newsletter_title, footer_newsletter_subtitle, instagram_url, support_email")
            .single(),
        supabase
            .from("categories")
            .select("name, slug")
            .order("created_at", { ascending: true })
            .limit(5)
    ])

    const currentYear = new Date().getFullYear()
    const storeName = settings?.store_name || "FASHION STORE"
    const aboutText = settings?.footer_about_text || "Pecas exclusivas com qualidade premium. Fazemos moda que conta historias."
    const newsletterTitle = settings?.footer_newsletter_title || "Fique por dentro"
    const newsletterSubtitle = settings?.footer_newsletter_subtitle || "Receba novidades e ofertas exclusivas."

    const categoryLinks = categories?.map((cat: { name: string; slug: string }) => ({
        href: `/${cat.slug}`,
        label: cat.name
    })) || [
        { href: "/produtos", label: "Todos os Produtos" }
    ]

    const sections = [
        { title: "Loja", links: [...categoryLinks, { href: "/produtos", label: "Ver Tudo" }] },
        { title: "Empresa", links: [{ href: "/sobre", label: "Sobre Nos" }, { href: "/contato", label: "Contato" }, { href: "/termos", label: "Termos de Uso" }] },
        { title: "Atendimento", links: [{ href: "/conta", label: "Minha Conta" }, { href: "/conta/pedidos", label: "Meus Pedidos" }, { href: "/carrinho", label: "Meu Carrinho" }] }
    ]

    return (
        <footer className="mt-0 w-full border-t border-white/10 bg-zinc-950 text-zinc-400">
            <FooterNewsletter title={newsletterTitle} subtitle={newsletterSubtitle} />

            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="mb-10 rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">Atelier digital</p>
                            <h3 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">{storeName}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{aboutText}</p>
                        </div>
                        <div className="flex gap-3">
                            {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/8 bg-zinc-900/80 p-3 transition-colors hover:bg-zinc-800"><Instagram className="h-4 w-4 text-zinc-300" /></a>}
                            {settings?.support_email && <a href={`mailto:${settings.support_email}`} className="rounded-xl border border-white/8 bg-zinc-900/80 p-3 transition-colors hover:bg-zinc-800"><Mail className="h-4 w-4 text-zinc-300" /></a>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="mb-4 block text-xl font-bold tracking-[-0.05em] text-white">{storeName}</Link>
                        <p className="mb-6 text-sm leading-relaxed text-zinc-500">Colecoes construidas com direcao visual forte, materia-prima selecionada e foco em pecas que permanecem relevantes.</p>
                    </div>
                    {sections.map((s) => <FooterLinksSection key={s.title} title={s.title} links={s.links} />)}
                </div>
            </div>

            <div className="border-t border-zinc-800">
                <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-zinc-600 md:flex-row">
                    <span>© {currentYear} {storeName}. Todos os direitos reservados.</span>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /><span>Operacao online com curadoria ativa</span></div>
                </div>
            </div>
        </footer>
    )
}
