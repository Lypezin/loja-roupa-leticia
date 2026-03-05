import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/ProductCard"
import { Button } from "@/components/ui/button"

export const revalidate = 60 // Revalida ISR a cada 60s p/ velocidade

export default async function StorefrontHome() {
    const supabase = await createClient()

    // Buscar Configurações Globais (Banner)
    const { data: settings } = await supabase
        .from('store_settings')
        .select('*')
        .single()

    // Buscar produtos ativos c/ categorias e a primeira foto para a Home.
    const { data: products } = await supabase
        .from('products')
        .select(`
      id, name, base_price,
      category:categories(name),
      images:product_images(image_url, is_primary)
    `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12) // Limitamos a home pros 12 mais novos/premium

    const heroTitle = settings?.hero_title || "A NOVA COLEÇÃO"
    const heroSubtitle = settings?.hero_subtitle || "Descubra as 30 peças exclusivas. Caimento estruturado, paleta minimalista e conforto definitivo."
    const heroButton = settings?.hero_button_text || "Descobrir Agora"
    const heroBg = settings?.hero_image_url || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070"

    return (
        <div className="flex flex-col">
            {/* Hero Banner Minimalista Premium */}
            <section className="relative h-[70vh] w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                {/* Imagem de Fundo customizada pelo Admin */}
                <div className="absolute inset-0 bg-zinc-900/50 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                    style={{ backgroundImage: `url('${heroBg}')` }}
                />

                <div className="relative z-20 container mx-auto px-4 text-center flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                        {heroTitle}
                    </h1>
                    <p className="text-zinc-200 text-lg md:text-xl max-w-xl mb-10 font-light">
                        {heroSubtitle}
                    </p>
                    <Button size="lg" className="rounded-full px-8 bg-white text-zinc-950 hover:bg-zinc-100 hover:scale-105 transition-all">
                        {heroButton}
                    </Button>
                </div>
            </section>

            {/* Grid de Produtos (Recentes) */}
            <section className="container mx-auto px-4 py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Lançamentos</h2>
                        <p className="text-zinc-500 mt-2">Peças recém adicionadas ao catálogo.</p>
                    </div>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map((product) => (
                            // @ts-ignore
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full py-12 text-center text-zinc-500">
                        Nenhum produto disponível no momento.
                    </div>
                )}
            </section>
        </div>
    )
}
