import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { StoreCategory } from "@/lib/storefront"

interface CategoriesSectionProps {
    categories: StoreCategory[]
    sectionLabel?: string
    sectionTitle?: string
}

export function CategoriesSection({ categories, sectionLabel = "Categorias", sectionTitle = "Escolha por tipo de peça" }: CategoriesSectionProps) {
    if (!categories || categories.length === 0) {
        return null
    }

    const featured = categories.slice(0, 3)
    const extras = categories.slice(3)

    return (
        <section className="page-shell py-10 md:py-16">
            <div className="mb-10 flex flex-col items-center justify-center text-center gap-4">
                <div className="animate-enter-soft flex flex-col items-center">
                    <span className="eyebrow justify-center">{sectionLabel}</span>
                    <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{sectionTitle}</h2>
                </div>
                <p className="animate-enter-soft animate-enter-delay-1 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                    Comece pelo tipo de peça. Depois a loja mostra só o que faz sentido para aquela busca.
                </p>
            </div>

            {/* Featured categories — big cards */}
            <div className="grid gap-5 md:grid-cols-3">
                {featured.map((category, index) => (
                    <article key={category.id} className={`group surface-card hover-lift-soft animate-enter-soft overflow-hidden rounded-[2rem] ${index === 0 ? "" : index === 1 ? "animate-enter-delay-1" : "animate-enter-delay-2"}`}>
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
                                    <h3 className="mt-3 font-display text-2xl text-foreground md:text-3xl">{category.name}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Veja os modelos desta seção com foto clara, cores disponíveis e compra direta.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

            {/* Extra categories — compact row */}
            {extras.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mais categorias</span>
                    {extras.map((category) => (
                        <Link
                            key={category.id}
                            href={`/${category.slug}`}
                            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
                        >
                            {category.image_url && (
                                <span className="relative h-5 w-5 overflow-hidden rounded-full shrink-0">
                                    <Image src={category.image_url} alt={category.name} fill className="object-cover" sizes="20px" />
                                </span>
                            )}
                            {category.name}
                        </Link>
                    ))}
                    <Link
                        href="/categorias"
                        className="ml-auto flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                    >
                        Ver todas <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            )}
        </section>
    )
}
