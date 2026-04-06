import Link from "next/link"
import { MessageCircle, RefreshCcw, ShieldCheck, Truck } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getStoreCategories, getStoreSettings } from "@/lib/storefront"
import { ProductCard } from "@/components/store/ProductCard"
import { HeroSection } from "@/components/store/HeroSection"
import { CategoriesSection } from "@/components/store/CategoriesSection"

export const revalidate = 60

type HomeProduct = {
    id: string
    name: string
    base_price: number
    category?: { name?: string | null } | null
    images?: { image_url: string; is_primary: boolean | null }[]
}

export default async function StorefrontHome() {
    const supabase = await createClient()

    const [settings, categories, { data: products }] = await Promise.all([
        getStoreSettings(),
        getStoreCategories(),
        supabase
            .from("products")
            .select(`
                id, name, base_price,
                category:categories(name),
                images:product_images(image_url, is_primary)
            `)
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(12),
    ])

    const heroTitle = settings?.hero_title || "Colecao autoral"
    const heroSubtitle = settings?.hero_subtitle || "Pecas com leitura mais calma, material honesto e um desenho que fica melhor ao vivo do que em excesso de efeito."
    const heroButton = settings?.hero_button_text || "Ver colecao"
    const heroBg = settings?.hero_image_url || "/placeholder-image.jpg"
    const heroBadge = settings?.hero_badge_text || "Capsula de estacao"
    const heroSecondaryButton = settings?.hero_secondary_button_text || "Conheca a marca"

    const productsSectionLabel = settings?.products_section_label || "Selecao"
    const productsSectionTitle = settings?.products_section_title || "Entradas da semana"
    const categoriesSectionLabel = settings?.categories_section_label || "Colecoes"
    const categoriesSectionTitle = settings?.categories_section_title || "Explore por categoria"

    const trustItems = [
        { icon: Truck, title: "Entrega para todo o Brasil", desc: "Frete claro e acompanhamento direto." },
        { icon: ShieldCheck, title: "Compra protegida", desc: "Pagamento seguro e fluxo objetivo." },
        { icon: RefreshCcw, title: "Troca assistida", desc: "Atendimento humano quando voce precisa." },
        { icon: MessageCircle, title: "Suporte rapido", desc: "Resposta com linguagem simples e direta." },
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
                countdownEnd={settings?.countdown_end || undefined}
            />

            <CategoriesSection
                categories={categories.slice(0, 3)}
                sectionLabel={categoriesSectionLabel}
                sectionTitle={categoriesSectionTitle}
            />

            <section className="page-shell py-8 md:py-14">
                <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="eyebrow">{productsSectionLabel}</span>
                            <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{productsSectionTitle}</h2>
                        </div>
                        <div className="max-w-xl">
                            <p className="section-lead">
                                Uma vitrine com menos ruido e mais criterio: preco legivel, imagem limpa e navegacao sem peso desnecessario.
                            </p>
                            <Link href="/produtos" className="ink-link mt-4">
                                Ver todas as pecas <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {products && products.length > 0 ? (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {(products as HomeProduct[]).map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center text-muted-foreground">
                        Nenhum produto disponivel no momento.
                    </div>
                )}
            </section>

            <section className="page-shell pb-14 md:pb-18">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {trustItems.map((item) => (
                        <div key={item.title} className="surface-card rounded-[1.6rem] p-5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
