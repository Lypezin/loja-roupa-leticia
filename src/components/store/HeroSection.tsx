'use client'

import { motion } from "framer-motion"
import Link from "next/link"

interface HeroSectionProps {
    title: string
    subtitle: string
    buttonText: string
    backgroundUrl: string
}

export function HeroSection({ title, subtitle, buttonText, backgroundUrl }: HeroSectionProps) {
    return (
        <section className="relative h-[85vh] w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
            {/* Background com Parallax sutil */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 transition-transform duration-[2s]"
                style={{ backgroundImage: `url('${backgroundUrl}')` }}
            />

            {/* Overlay Gradiente Premium */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 to-transparent z-10" />

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
            />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-start md:items-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-2xl text-left md:text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 mb-6 border border-zinc-700/50 px-4 py-1.5 rounded-full"
                    >
                        Nova Coleção 2025
                    </motion.span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-[-0.04em] leading-[0.9] mb-6">
                        {title}
                    </h1>

                    <p className="text-zinc-300 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed font-light">
                        {subtitle}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Link
                            href="/camisetas"
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-950 text-sm font-semibold rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                        >
                            <span className="relative z-10">{buttonText}</span>
                            <span className="absolute inset-0 bg-zinc-100 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>

                        <Link
                            href="/sobre"
                            className="inline-flex items-center justify-center px-8 py-4 border border-zinc-600 text-white text-sm font-medium rounded-full hover:border-zinc-400 hover:bg-white/5 transition-all"
                        >
                            Conheça a marca
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-5 h-8 border-2 border-zinc-500 rounded-full flex justify-center pt-1.5"
                >
                    <div className="w-1 h-2 bg-zinc-400 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    )
}
