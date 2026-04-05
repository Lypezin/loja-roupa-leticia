'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { CountdownTimer } from "./CountdownTimer"

interface HeroContentProps {
    title: string
    subtitle: string
    buttonText: string
    badgeText?: string
    secondaryButtonText?: string
    countdownEnd?: string
}

export function HeroContent({ title, subtitle, buttonText, badgeText, secondaryButtonText, countdownEnd }: HeroContentProps) {
    return (
        <div className="relative z-30 container mx-auto flex flex-col items-center px-6 pt-28 text-center md:pt-36">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-5xl"
            >
                {badgeText && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 backdrop-blur-xl"
                    >
                        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/80">{badgeText}</span>
                    </motion.div>
                )}

                <div className="mb-6 flex items-center justify-center">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/70 to-transparent md:w-28" />
                </div>

                <h1 className="text-gradient mb-6 text-4xl font-bold leading-[0.85] tracking-[-0.06em] sm:text-6xl md:mb-8 md:text-8xl lg:text-[8.4rem]">
                    {title.split(" ").map((word, i) => (
                        <motion.span
                            key={i}
                            className="mr-[0.2em] inline-block"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1), duration: 0.8 }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/72 md:mb-12 md:text-xl"
                >
                    {subtitle}
                </motion.p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/produtos"
                            className="group relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white px-8 py-4 text-sm font-bold text-zinc-950 transition-all hover:shadow-[0_20px_45px_rgba(0,0,0,0.28)] md:px-10 md:py-5"
                        >
                            <span className="relative z-10">{buttonText}</span>
                            <motion.div className="brand-gradient absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                        </Link>
                    </motion.div>

                    {secondaryButtonText && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/sobre"
                                className="rounded-full border border-white/18 bg-white/8 px-10 py-5 text-sm font-bold text-white backdrop-blur-xl transition-all hover:bg-white/14"
                            >
                                {secondaryButtonText}
                            </Link>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-5"
                >
                    {["Modelagem premium", "Entrega nacional", "Curadoria autoral"].map((item) => (
                        <span key={item} className="rounded-full border border-white/12 bg-black/15 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/70">
                            {item}
                        </span>
                    ))}
                </motion.div>

                {countdownEnd && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mt-14 inline-block"
                    >
                        <div className="glass rounded-[2rem] px-8 py-6">
                            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">A oferta encerra em</p>
                            <CountdownTimer targetDate={countdownEnd} />
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
