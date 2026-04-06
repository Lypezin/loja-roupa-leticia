import { createClient } from "@/lib/supabase/server"
import { getStoreCategories, getStoreSettings } from "@/lib/storefront"
import { HeroSection } from "@/components/store/HeroSection"
import { CategoriesSection } from "@/components/store/CategoriesSection"
import { LatestProductsSection } from "@/components/store/LatestProductsSection"
import { TrustSection } from "@/components/store/TrustSection"

export const revalidate = 60

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
    const heroSubtitle = settings?.hero_subtitle || "Novidades e reposicoes com foto clara, bom caimento e compra simples do inicio ao fim."
    const heroButton = settings?.hero_button_text || "Ver colecao"
    const heroBg = settings?.hero_image_url || "/placeholder-image.jpg"
    const heroBadge = settings?.hero_badge_text || "Capsula de estacao"
    const heroSecondaryButton = settings?.hero_secondary_button_text || "Conheca a marca"

    const productsSectionLabel = settings?.products_section_label || "Selecao"
    const productsSectionTitle = settings?.products_section_title || "Entradas da semana"
    const categoriesSectionLabel = settings?.categories_section_label || "Colecoes"
    const categoriesSectionTitle = settings?.categories_section_title || "Explore por categoria"

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

            <LatestProductsSection
                products={products as any}
                sectionLabel={productsSectionLabel}
                sectionTitle={productsSectionTitle}
            />

            <TrustSection />
        </div>
    )
}
