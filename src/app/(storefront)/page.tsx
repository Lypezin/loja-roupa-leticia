import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"
import { HeroSection } from "@/components/store/HeroSection"
import { CategoriesSection } from "@/components/store/CategoriesSection"

export const revalidate = 60

export default async function StorefrontHome() {
    const supabase = await createClient()

    const { data: settings } = await supabase
        .from('store_settings')
        .select('*')
        .single()

    const { data: latestCategories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(3)

    const { data: products } = await supabase
        .from('products')
        .select(`
      id, name, base_price,
      category:categories(name),
      images:product_images(image_url, is_primary)
    `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12)

    // Hero settings
    const heroTitle = settings?.hero_title || "A NOVA COLEÇÃO"
    const heroSubtitle = settings?.hero_subtitle || "Descubra peças exclusivas. Caimento estruturado, paleta minimalista e conforto definitivo."
    const heroButton = settings?.hero_button_text || "Descobrir Agora"
    const heroBg = settings?.hero_image_url || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070"
    const heroBadge = settings?.hero_badge_text || "Nova Coleção 2025"
    const heroSecondaryButton = settings?.hero_secondary_button_text || "Conheça a marca"

    // Section settings
    const productsSectionLabel = settings?.products_section_label || "Novidades"
    const productsSectionTitle = settings?.products_section_title || "Lançamentos"
    const categoriesSectionLabel = settings?.categories_section_label || "Coleções"
    const categoriesSectionTitle = settings?.categories_section_title || "Explore por Categoria"

    // Trust items from settings
    const trustItems = [
        { emoji: "🚀", title: settings?.trust_banner_1_title || "Envio Rápido", desc: settings?.trust_banner_1_desc || "Para todo o Brasil" },
        { emoji: "🔒", title: settings?.trust_banner_2_title || "Compra Segura", desc: settings?.trust_banner_2_desc || "Pagamento protegido" },
        { emoji: "↩️", title: settings?.trust_banner_3_title || "Trocas Fáceis", desc: settings?.trust_banner_3_desc || "Em até 7 dias" },
        { emoji: "💬", title: settings?.trust_banner_4_title || "Suporte", desc: settings?.trust_banner_4_desc || "Atendimento humanizado" },
    ]

    return (
        <div className="flex flex-col">
            {/* Hero Banner Premium */}
            <HeroSection
                title={heroTitle}
                subtitle={heroSubtitle}
                buttonText={heroButton}
                backgroundUrl={heroBg}
                badgeText={heroBadge}
                secondaryButtonText={heroSecondaryButton}
                countdownEnd={settings?.countdown_end}
            />

            {/* Categorias com Hover Expand */}
            <CategoriesSection
                categories={latestCategories || []}
                sectionLabel={categoriesSectionLabel}
                sectionTitle={categoriesSectionTitle}
            />

            {/* Produtos Recentes */}
            <section className="container mx-auto px-4 py-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                            {productsSectionLabel}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{productsSectionTitle}</h2>
                    </div>
                    <a href="/produtos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        Ver tudo →
                    </a>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map((product, i) => (
                            // @ts-ignore
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full py-16 text-center text-muted-foreground">
                        Nenhum produto disponível no momento.
                    </div>
                )}
            </section>

            {/* Trust Banner */}
            <section className="border-y border-border bg-muted/30">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {trustItems.map((item) => (
                            <div key={item.title} className="flex flex-col items-center gap-2">
                                <span className="text-2xl">{item.emoji}</span>
                                <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
