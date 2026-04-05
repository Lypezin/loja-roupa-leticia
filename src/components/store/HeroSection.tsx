'use client'

import { motion } from "framer-motion"
import { HeroBackground } from "./HeroBackground"
import { HeroContent } from "./HeroContent"

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
        <section className="relative min-h-[92vh] w-full overflow-hidden border-b border-white/10 bg-zinc-950">
            <div className="absolute inset-0 mesh-gradient opacity-80" />
            <div className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <HeroBackground backgroundUrl={backgroundUrl} title={title} />
            <HeroContent
                title={title}
                subtitle={subtitle}
                buttonText={buttonText}
                badgeText={badgeText}
                secondaryButtonText={secondaryButtonText}
                countdownEnd={countdownEnd}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/45">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-14 w-px bg-gradient-to-b from-white/70 to-transparent"
                    />
                </div>
            </motion.div>
        </section>
    )
}
