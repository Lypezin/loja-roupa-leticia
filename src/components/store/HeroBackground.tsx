'use client'

import { motion } from "framer-motion"
import Image from "next/image"

interface HeroBackgroundProps {
    backgroundUrl: string;
    title: string;
}

export function HeroBackground({ backgroundUrl, title }: HeroBackgroundProps) {
    return (
        <>
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

            {/* Elementos Decorativos de Profundidade */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-[15%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-10"
            />
            <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-[10%] w-96 h-96 bg-zinc-500/10 rounded-full blur-[100px] pointer-events-none z-10"
            />

            {/* Grain Texture */}
            <div className="absolute inset-0 z-20 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
            />
        </>
    )
}
