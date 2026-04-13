import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getStoreCategories, getStoreSettings } from "@/lib/storefront"

export const revalidate = 60

export const metadata: Metadata = {
    title: "Categorias",
    description: "Veja todas as categorias disponíveis na loja e encontre as peças que combinam com você.",
}

export default async function CategoriasPage() {
    const [categories, settings] = await Promise.all([
        getStoreCategories(),
        getStoreSettings(),
    ])

    return (
        <div className="page-shell py-10 md:py-16">
            {/* Header */}
            <div className="paper-panel animate-enter-soft rounded-[2rem] px-6 py-8 md:px-10 md:py-10 mb-10">
                <span className="eyebrow">categorias</span>
                <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
                    {settings?.categories_section_title || "Escolha por tipo de peça"}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                    Explore todas as categorias disponíveis. Clique em uma para ver as peças exclusivas de cada seção.
                </p>
            </div>

            {/* Grid */}
            {categories.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                    Nenhuma categoria cadastrada ainda.
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {categories.map((category, index) => (
                        <article
                            key={category.id}
                            className={`group surface-card hover-lift-soft animate-enter-soft overflow-hidden rounded-[2rem] ${index < 4 ? `animate-enter-delay-${index}` : ""}`}
                        >
                            <Link href={`/${category.slug}`} className="block">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <Image
                                        src={category.image_url || "/placeholder-image.jpg"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/46 via-black/10 to-white/6" />
                                </div>

                                <div className="relative -mt-16 p-4 md:-mt-20 md:p-5">
                                    <div className="glass rounded-[1.6rem] px-5 py-5">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">categoria</p>
                                        <h2 className="mt-3 font-display text-2xl text-foreground md:text-3xl">{category.name}</h2>
                                        <p className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                                            Ver peças <ArrowRight className="h-3.5 w-3.5" />
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
