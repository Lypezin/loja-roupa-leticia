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

import { HeroBackground } from "./HeroBackground"
import { HeroContent } from "./HeroContent"

export function HeroSection({ title, subtitle, buttonText, backgroundUrl, badgeText, secondaryButtonText, countdownEnd }: HeroSectionProps) {
    return (
        <section className="relative h-[90vh] w-full bg-zinc-950 flex items-center justify-center overflow-hidden mesh-gradient">
            <HeroBackground backgroundUrl={backgroundUrl} title={title} />
            <HeroContent title={title} subtitle={subtitle} buttonText={buttonText} badgeText={badgeText} secondaryButtonText={secondaryButtonText} countdownEnd={countdownEnd} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold">Scroll</span>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-[1px] h-12 bg-gradient-to-b from-zinc-800 to-transparent" />
                </div>
            </motion.div>
        </section>
    )
}
