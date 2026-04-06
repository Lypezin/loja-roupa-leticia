import Link from "next/link"
import Image from "next/image"
import type { StoreCategory } from "@/lib/storefront"

interface CategoriesSectionProps {
    categories: StoreCategory[]
    sectionLabel?: string
    sectionTitle?: string
}

export function CategoriesSection({ categories, sectionLabel = "Colecoes", sectionTitle = "Explore por categoria" }: CategoriesSectionProps) {
    if (!categories || categories.length === 0) return null

    return (
        <section className="page-shell py-10 md:py-16">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <span className="eyebrow">{sectionLabel}</span>
                    <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{sectionTitle}</h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                    Cada categoria organiza a loja por tipo de peca e deixa a busca mais rapida.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {categories.slice(0, 3).map((category) => (
                    <article key={category.id} className="group surface-card overflow-hidden rounded-[2rem]">
                        <Link href={`/${category.slug}`} className="block">
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={category.image_url || "/placeholder-image.jpg"}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/46 via-black/10 to-white/6" />
                            </div>

                            <div className="relative -mt-16 p-4 md:-mt-20 md:p-5">
                                <div className="glass rounded-[1.6rem] px-5 py-5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">categoria</p>
                                    <h3 className="mt-3 font-display text-3xl text-foreground">{category.name}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Veja modelos do mesmo grupo com imagem limpa e navegacao mais simples.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    )
}
