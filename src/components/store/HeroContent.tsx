'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { CountdownTimer } from "./CountdownTimer"

interface HeroContentProps {
    title: string;
    subtitle: string;
    buttonText: string;
    badgeText?: string;
    secondaryButtonText?: string;
    countdownEnd?: string;
}

export function HeroContent({ title, subtitle, buttonText, badgeText, secondaryButtonText, countdownEnd }: HeroContentProps) {
    return (
        <div className="relative z-30 container mx-auto px-6 flex flex-col items-center text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
            >
                {badgeText && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/80">{badgeText}</span>
                    </motion.div>
                )}

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] mb-8 text-gradient">
                    {title.split(' ').map((word, i) => (
                        <motion.span key={i} className="inline-block mr-[0.2em]" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.1), duration: 0.8 }}>
                            {word}
                        </motion.span>
                    ))}
                </h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
                    {subtitle}
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/camisetas" className="group relative flex items-center justify-center px-10 py-5 bg-foreground text-background text-sm font-bold rounded-full transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden">
                            <span className="relative z-10">{buttonText}</span>
                            <motion.div className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                        </Link>
                    </motion.div>

                    {secondaryButtonText && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/sobre" className="glass px-10 py-5 text-sm font-bold rounded-full hover:bg-white/10 transition-all border border-white/10">
                                {secondaryButtonText}
                            </Link>
                        </motion.div>
                    )}
                </div>

                {countdownEnd && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mt-16 inline-block">
                        <div className="glass px-8 py-6 rounded-3xl">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">A oferta encerra em</p>
                            <CountdownTimer targetDate={countdownEnd} />
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
