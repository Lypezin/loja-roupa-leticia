'use client'

import Link from "next/link"
import { motion } from "framer-motion"

interface CategoriesSectionProps {
    categories: any[]
    sectionLabel?: string
    sectionTitle?: string
}

export function CategoriesSection({ categories, sectionLabel = "Colecoes", sectionTitle = "Explore por Categoria" }: CategoriesSectionProps) {
    if (!categories || categories.length === 0) return null

    return (
        <section className="container mx-auto px-4 py-20">
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {sectionLabel}
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{sectionTitle}</h2>
                </div>
            </div>

            <div className="flex h-auto flex-col gap-4 md:h-[430px] md:flex-row">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.id || cat.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="paper-panel group relative min-h-[220px] flex-1 cursor-pointer overflow-hidden rounded-[2rem] border border-white/40 transition-all duration-500 ease-in-out md:min-h-0 md:hover:flex-[1.8]"
                    >
                        <Link href={`/${cat.slug}`} className="absolute inset-0 z-20" />
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${cat.image_url || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800"})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />
                        <div className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/70 backdrop-blur-md">
                            Curadoria
                        </div>
                        <div className="absolute bottom-6 left-6 z-10 max-w-[80%]">
                            <h3 className="text-xl font-bold tracking-tight text-white md:text-3xl">
                                {cat.name}
                            </h3>
                            <p className="mt-2 text-sm text-white/70">
                                Editoriais visuais e pecas com identidade propria.
                            </p>
                            <span className="mt-4 inline-flex text-sm font-medium text-zinc-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                Ver colecao →
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
