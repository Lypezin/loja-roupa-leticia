import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import type { StoreCategory, StoreSettings } from "@/lib/storefront"
import { FooterLinksSection } from "./FooterLinksSection"

export function Footer({
    categories = [],
    settings,
}: {
    categories?: StoreCategory[]
    settings?: StoreSettings | null
}) {
    const currentYear = new Date().getFullYear()
    const storeName = settings?.store_name || "FASHION STORE"
    const aboutText = settings?.footer_about_text || "Pecas com foto clara, descricao objetiva e compra simples do primeiro clique ao pos-venda."

    const categoryLinks = categories.length > 0
        ? categories.slice(0, 4).map((cat) => ({
            href: `/${cat.slug}`,
            label: cat.name,
        }))
        : [{ href: "/produtos", label: "Todos os produtos" }]

    const sections = [
        { title: "Loja", links: [...categoryLinks, { href: "/produtos", label: "Ver tudo" }] },
        { title: "Institucional", links: [{ href: "/sobre", label: "Sobre a marca" }, { href: "/contato", label: "Contato" }, { href: "/termos", label: "Termos de uso" }] },
        { title: "Atendimento", links: [{ href: "/conta", label: "Minha conta" }, { href: "/conta/pedidos", label: "Meus pedidos" }, { href: "/carrinho", label: "Sacola" }] },
    ]

    return (
        <footer className="mt-0 w-full border-t border-border/70 bg-background text-foreground">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="paper-panel animate-enter-soft mb-10 rounded-[2rem] p-6 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <span className="eyebrow">atendimento online</span>
                            <h3 className="mt-4 font-display text-3xl text-foreground md:text-4xl">{storeName}</h3>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{aboutText}</p>
                        </div>
                        <div className="flex gap-3">
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover-lift-soft flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                                    <Instagram className="h-4 w-4" />
                                </a>
                            )}
                            {settings?.support_email && (
                                <a href={`mailto:${settings.support_email}`} className="hover-lift-soft flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                                    <Mail className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <div className="col-span-1 sm:col-span-2 md:col-span-1">
                        <Link href="/" className="mb-4 block font-display text-2xl text-foreground">{storeName}</Link>
                        <p className="mb-6 text-sm leading-7 text-muted-foreground">Escolha por categoria, confira as fotos e finalize a compra sem etapas confusas.</p>
                    </div>
                    {sections.map((section) => (
                        <FooterLinksSection key={section.title} title={section.title} links={section.links} />
                    ))}
                </div>
            </div>

            <div className="border-t border-border/70">
                <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row">
                    <span>&copy; {currentYear} {storeName}. Todos os direitos reservados.</span>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span>Atendimento humano em horario comercial</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
