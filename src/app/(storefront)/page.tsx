import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"
import { HeroSection } from "@/components/store/HeroSection"
import { CategoriesSection } from "@/components/store/CategoriesSection"

export const revalidate = 60

export default async function StorefrontHome() {
    const supabase = await createClient()

    const [
        { data: settings },
        { data: latestCategories },
        { data: products }
    ] = await Promise.all([
        supabase.from("store_settings").select("*").single(),
        supabase.from("categories").select("*").order("created_at", { ascending: true }).limit(3),
        supabase.from("products").select(`
            id, name, base_price,
            category:categories(name),
            images:product_images(image_url, is_primary)
        `).eq("is_active", true).order("created_at", { ascending: false }).limit(12)
    ])

    const heroTitle = settings?.hero_title || "A NOVA COLECAO"
    const heroSubtitle = settings?.hero_subtitle || "Descubra pecas exclusivas. Caimento estruturado, paleta minimalista e conforto definitivo."
    const heroButton = settings?.hero_button_text || "Descobrir Agora"
    const heroBg = settings?.hero_image_url || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070"
    const heroBadge = settings?.hero_badge_text || "Nova Colecao 2025"
    const heroSecondaryButton = settings?.hero_secondary_button_text || "Conheca a marca"

    const productsSectionLabel = settings?.products_section_label || "Novidades"
    const productsSectionTitle = settings?.products_section_title || "Lancamentos"
    const categoriesSectionLabel = settings?.categories_section_label || "Colecoes"
    const categoriesSectionTitle = settings?.categories_section_title || "Explore por Categoria"

    const trustItems = [
        { emoji: "🚀", title: settings?.trust_banner_1_title || "Envio Rapido", desc: settings?.trust_banner_1_desc || "Para todo o Brasil" },
        { emoji: "🔒", title: settings?.trust_banner_2_title || "Compra Segura", desc: settings?.trust_banner_2_desc || "Pagamento protegido" },
        { emoji: "↩️", title: settings?.trust_banner_3_title || "Trocas Faceis", desc: settings?.trust_banner_3_desc || "Em ate 7 dias" },
        { emoji: "💬", title: settings?.trust_banner_4_title || "Suporte", desc: settings?.trust_banner_4_desc || "Atendimento humanizado" },
    ]

    return (
        <div className="flex flex-col">
            <HeroSection
                title={heroTitle}
                subtitle={heroSubtitle}
                buttonText={heroButton}
                backgroundUrl={heroBg}
                badgeText={heroBadge}
                secondaryButtonText={heroSecondaryButton}
                countdownEnd={settings?.countdown_end}
            />

            <CategoriesSection
                categories={latestCategories || []}
                sectionLabel={categoriesSectionLabel}
                sectionTitle={categoriesSectionTitle}
            />

            <section className="container mx-auto px-4 py-12 md:py-20">
                <div className="paper-panel mb-12 rounded-[2rem] border border-white/40 px-6 py-6 md:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {productsSectionLabel}
                            </span>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{productsSectionTitle}</h2>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                Uma selecao de entrada para a vitrine principal, com pecas de apelo mais forte e imagens de maior impacto.
                            </p>
                        </div>
                        <Link href="/produtos" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-70">
                            Ver tudo <span className="text-primary">→</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_2fr] lg:items-start">
                    <div>
                        <div className="rounded-[2rem] border border-white/35 bg-zinc-950 p-6 text-white shadow-[0_24px_60px_rgba(18,12,8,0.18)]">
                            <p className="text-[11px] uppercase tracking-[0.26em] text-white/50">Selecao da semana</p>
                            <h3 className="mt-3 text-2xl font-bold tracking-tight">Moda com presenca, nao volume.</h3>
                            <p className="mt-4 text-sm leading-relaxed text-white/70">
                                A loja agora assume um visual mais editorial, com contraste mais forte, blocos de destaque e superficies mais materiais.
                            </p>
                        </div>
                    </div>

                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                            {products.map((product: any, i: number) => (
                                <ProductCard key={product.id} product={product} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="col-span-full py-16 text-center text-muted-foreground">
                            Nenhum produto disponivel no momento.
                        </div>
                    )}
                </div>
            </section>

            <section className="border-y border-border/70 bg-white/35 py-12 backdrop-blur-sm dark:bg-white/[0.02]">
                <div className="container mx-auto px-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {trustItems.map((item) => (
                            <div key={item.title} className="rounded-[1.6rem] border border-white/35 bg-white/70 p-5 text-left shadow-[0_18px_40px_rgba(83,61,39,0.06)] backdrop-blur-sm dark:border-white/8 dark:bg-white/[0.04]">
                                <span className="text-2xl">{item.emoji}</span>
                                <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
