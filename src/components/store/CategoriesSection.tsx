'use client'

import Link from "next/link"
import { motion } from "framer-motion"

interface CategoriesSectionProps {
    categories: any[]
    sectionLabel?: string
    sectionTitle?: string
}

export function CategoriesSection({ categories, sectionLabel = "Coleções", sectionTitle = "Explore por Categoria" }: CategoriesSectionProps) {
    if (!categories || categories.length === 0) return null

    return (
        <section className="container mx-auto px-4 py-20">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                        {sectionLabel}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{sectionTitle}</h2>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[400px]">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.id || cat.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="group relative flex-1 min-h-[200px] md:min-h-0 rounded-2xl overflow-hidden cursor-pointer hover:flex-[2] transition-all duration-500 ease-in-out bg-zinc-900"
                    >
                        <Link href={`/${cat.slug}`} className="absolute inset-0 z-20" />
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${cat.image_url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 z-10">
                            <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">
                                {cat.name}
                            </h3>
                            <span className="text-zinc-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Ver coleção →
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
