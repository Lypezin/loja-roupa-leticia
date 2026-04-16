import { createPublicClient } from "@/lib/supabase/public"
import { getStoreCategories, getStoreSettings } from "@/lib/storefront"
import { HeroSection } from "@/components/store/HeroSection"
import { CategoriesSection } from "@/components/store/CategoriesSection"
import { LatestProductsSection } from "@/components/store/LatestProductsSection"
import { TrustSection } from "@/components/store/TrustSection"

export const revalidate = 60

type HomeProduct = {
    id: string
    slug: string
    name: string
    base_price: number
    category?: { name?: string | null } | null
    images?: { image_url: string; is_primary: boolean | null; display_order?: number | null }[]
}

export default async function StorefrontHome() {
    const supabase = createPublicClient()

    const [settings, categories, { data: products }] = await Promise.all([
        getStoreSettings(),
        getStoreCategories(),
        supabase
            .from("products")
            .select(`
                id, slug, name, base_price,
                category:categories(name),
                images:product_images(image_url, is_primary, display_order)
            `)
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(12),
    ])

    const heroTitle = settings?.hero_title || "Peças que entram bem no dia a dia"
    const heroSubtitle = settings?.hero_subtitle || "Descubra uma curadoria pensada para você, unindo design inteligente, conforto e beleza para tornar seus dias mais especiais."
    const heroButton = settings?.hero_button_text || "Ver novidades"
    const heroBg = settings?.hero_image_url || "/placeholder-image.jpg"
    const heroBadge = settings?.hero_badge_text || "novidades da semana"
    const heroSecondaryButton = settings?.hero_secondary_button_text || "Sobre a marca"

    const productsSectionLabel = settings?.products_section_label || "novidades"
    const productsSectionTitle = settings?.products_section_title || "Peças que acabaram de chegar"
    const categoriesSectionLabel = settings?.categories_section_label || "categorias"
    const categoriesSectionTitle = settings?.categories_section_title || "Escolha por tipo de peça"

    return (
        <div className="flex flex-col">
            <HeroSection
                title={heroTitle}
                subtitle={heroSubtitle}
                buttonText={heroButton}
                backgroundUrl={heroBg}
                badgeText={heroBadge}
                secondaryButtonText={heroSecondaryButton}
            />

            <CategoriesSection
                categories={categories}
                sectionLabel={categoriesSectionLabel}
                sectionTitle={categoriesSectionTitle}
            />

            <LatestProductsSection
                products={(products ?? []) as HomeProduct[]}
                sectionLabel={productsSectionLabel}
                sectionTitle={productsSectionTitle}
            />

            <TrustSection settings={settings} />
        </div>
    )
}
