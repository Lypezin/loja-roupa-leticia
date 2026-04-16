import Link from "next/link"
import { ProductCard } from "@/components/store/ProductCard"

type HomeProduct = {
  id: string
  slug: string
  name: string
  base_price: number
  category?: { name?: string | null } | null
  images?: { image_url: string; is_primary: boolean | null }[]
}

interface LatestProductsSectionProps {
  products: HomeProduct[] | null
  sectionLabel: string
  sectionTitle: string
}

export function LatestProductsSection({
  products,
  sectionLabel,
  sectionTitle,
}: LatestProductsSectionProps) {
  return (
    <section className="page-shell py-8 md:py-14">
      <div className="paper-panel animate-enter-soft rounded-[2rem] border border-muted/20 bg-paper/30 px-6 py-6 backdrop-blur-sm md:px-8">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <div className="flex flex-col items-center">
            <span className="eyebrow justify-center">{sectionLabel}</span>
            <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
              {sectionTitle}
            </h2>
          </div>
          <div className="max-w-xl flex flex-col items-center">
            <p className="section-lead text-center">
              Entradas recentes, reposições e peças que voltaram para o estoque.
            </p>
            <Link href="/produtos" className="ink-link mt-4 inline-block font-medium transition-transform hover:translate-x-1">
              Ver todas as peças -
            </Link>
          </div>
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl bg-surface-muted/10 py-16 text-center text-muted-foreground">
          Nenhum produto disponível no momento.
        </div>
      )}
    </section>
  )
}
