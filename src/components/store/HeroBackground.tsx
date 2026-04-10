import Image from "next/image"

interface HeroBackgroundProps {
    backgroundUrl: string
    title: string
}

const FALLBACK_HERO_IMAGE = "/placeholder-image.jpg"

export function HeroBackground({ backgroundUrl, title }: HeroBackgroundProps) {
    const imageSrc = backgroundUrl || FALLBACK_HERO_IMAGE

    return (
        <div className="animate-enter-soft animate-enter-delay-2 relative">
            <div className="absolute -left-4 top-8 hidden h-32 w-32 rounded-full border border-primary/10 bg-primary/6 blur-3xl lg:block" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-card shadow-[0_26px_60px_rgba(68,48,31,0.12)]">
                <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,rgba(247,242,236,0.92),rgba(235,225,214,0.92))] md:aspect-[5/6]">
                    <div className="absolute inset-0 scale-110 opacity-22 blur-2xl">
                        <Image
                            src={imageSrc}
                            alt=""
                            fill
                            aria-hidden
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 42vw"
                            quality={72}
                        />
                    </div>

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_58%)]" />

                    <div className="absolute inset-0 p-4 md:p-5">
                        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/34 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                            <Image
                                src={imageSrc}
                                alt={title}
                                fill
                                priority
                                className="animate-float-slow object-contain object-center"
                                sizes="(max-width: 1024px) 100vw, 42vw"
                                quality={90}
                            />
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-white/10" />
                </div>

                <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/82 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/76 md:left-5 md:top-5">
                    em destaque
                </div>
            </div>
        </div>
    )
}
