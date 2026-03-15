'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { CountdownTimer } from "./CountdownTimer"

interface HeroSectionProps {
    title: string
    subtitle: string
    buttonText: string
    backgroundUrl: string
    badgeText?: string
    secondaryButtonText?: string
    countdownEnd?: string
}

export function HeroSection({ title, subtitle, buttonText, backgroundUrl, badgeText, secondaryButtonText, countdownEnd }: HeroSectionProps) {
    return (
        <section className="relative h-[90vh] w-full bg-zinc-950 flex items-center justify-center overflow-hidden mesh-gradient">
            {/* Background com parallax suave */}
            <motion.div 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src={backgroundUrl}
                    alt={title}
                    fill
                    priority
                    className="object-cover opacity-60 mix-blend-luminosity"
                    sizes="100vw"
                    quality={90}
                />
            </motion.div>

            {/* Overlays Cinemáticos */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/90 z-10" />
            <div className="absolute inset-0 bg-zinc-950/20 z-10" />

            {/* Elementos Decorativos de Profundidade (Glass Spheres) */}
            <motion.div 
                animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-[15%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-10" 
            />
            <motion.div 
                animate={{ 
                    y: [0, 20, 0],
                    rotate: [0, -10, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-[10%] w-96 h-96 bg-zinc-500/10 rounded-full blur-[100px] pointer-events-none z-10" 
            />

            {/* Grain Texture */}
            <div className="absolute inset-0 z-20 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
            />

            {/* Content Container */}
            <div className="relative z-30 container mx-auto px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-4xl"
                >
                    {badgeText && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/80">
                                {badgeText}
                            </span>
                        </motion.div>
                    )}

                    {title && (
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] mb-8 text-gradient">
                            {title.split(' ').map((word, i) => (
                                <motion.span 
                                    key={i} 
                                    className="inline-block mr-[0.2em]"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1), duration: 0.8 }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>
                    )}

                    {subtitle && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {/* Botões com Efeito Magnético (Simulado via motion) */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {buttonText && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/camisetas"
                                    className="group relative flex items-center justify-center px-10 py-5 bg-foreground text-background text-sm font-bold rounded-full transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden"
                                >
                                    <span className="relative z-10">{buttonText}</span>
                                    <motion.div 
                                        className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                                    />
                                </Link>
                            </motion.div>
                        )}

                        {secondaryButtonText && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/sobre"
                                    className="glass px-10 py-5 text-sm font-bold rounded-full hover:bg-white/10 transition-all border border-white/10"
                                >
                                    {secondaryButtonText}
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {countdownEnd && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="mt-16 inline-block"
                        >
                            <div className="glass px-8 py-6 rounded-3xl">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">A oferta encerra em</p>
                                <CountdownTimer targetDate={countdownEnd} />
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Scroll Indicator Refinado */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-[1px] h-12 bg-gradient-to-b from-zinc-800 to-transparent"
                    />
                </div>
            </motion.div>
        </section>
    )
}
