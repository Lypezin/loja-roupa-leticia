'use client'

import { motion } from "framer-motion"
import Image from "next/image"

interface HeroBackgroundProps {
    backgroundUrl: string
    title: string
}

export function HeroBackground({ backgroundUrl, title }: HeroBackgroundProps) {
    return (
        <>
            <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src={backgroundUrl}
                    alt={title}
                    fill
                    priority
                    className="object-cover opacity-75"
                    sizes="100vw"
                    quality={90}
                />
            </motion.div>

            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,243,221,0.22),transparent_30%),linear-gradient(120deg,rgba(15,10,8,0.72),rgba(15,10,8,0.3)_42%,rgba(15,10,8,0.85))]" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/70 via-zinc-950/20 to-zinc-950/92" />
            <div className="absolute left-[6%] top-[18%] z-10 h-40 w-40 animate-float-slow rounded-full border border-white/15 bg-white/8 blur-3xl" />
            <div className="absolute right-[10%] top-[24%] z-10 h-56 w-56 rounded-full border border-amber-200/15 bg-amber-200/8 blur-[110px]" />
            <div className="absolute bottom-[10%] left-[8%] z-10 h-52 w-52 rounded-full bg-cyan-200/10 blur-[120px]" />

            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute right-[15%] top-20 z-10 h-64 w-64 rounded-full bg-primary/20 blur-[80px]"
            />
            <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute bottom-20 left-[10%] z-10 h-96 w-96 rounded-full bg-zinc-500/10 blur-[100px]"
            />

            <div
                className="pointer-events-none absolute inset-0 z-20 opacity-[0.05]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
            />
        </>
    )
}
