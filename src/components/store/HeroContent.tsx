import Link from "next/link"
import { ShieldCheck, Sparkles, Scissors } from "lucide-react"

interface HeroContentProps {
    title: string
    subtitle: string
    buttonText: string
    badgeText?: string
    secondaryButtonText?: string
}

const heroFacts = [
    { label: "Tecidos Premium", value: "Toque macio e durável", icon: Sparkles },
    { label: "Caimento Ideal", value: "Modelagem impecável", icon: Scissors },
    { label: "Compra Segura", value: "Primeira troca grátis", icon: ShieldCheck },
]

export function HeroContent({ title, subtitle, buttonText, badgeText, secondaryButtonText }: HeroContentProps) {
    return (
        <div className="flex flex-col justify-center py-1 md:py-4">
            <span className="eyebrow animate-enter-soft">{badgeText || "novidades da semana"}</span>

            <h1 className="animate-enter-soft animate-enter-delay-1 mt-4 max-w-3xl font-display text-[2.45rem] leading-[0.94] text-foreground sm:text-[3.3rem] md:mt-5 md:text-[5.2rem]">
                {title}
            </h1>

            <p className="animate-enter-soft animate-enter-delay-1 mt-4 max-w-xl text-[0.95rem] leading-7 text-muted-foreground md:mt-6 md:text-lg md:leading-8">
                {subtitle}
            </p>

            <div className="animate-enter-soft animate-enter-delay-2 mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
                <Link
                    href="/produtos"
                    className="interactive-press inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] sm:w-auto"
                >
                    {buttonText}
                </Link>

                {secondaryButtonText && (
                    <Link
                        href="/sobre"
                        className="interactive-press inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                    >
                        {secondaryButtonText}
                    </Link>
                )}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3 md:mt-10">
                {heroFacts.map((item, index) => (
                    <div
                        key={item.label}
                        className={`group interactive-panel animate-enter-soft flex items-center gap-3 rounded-[1.25rem] border border-zinc-200/60 bg-white/60 px-3.5 py-3.5 shadow-sm backdrop-blur-md hover:-translate-y-1 hover:border-zinc-300 hover:bg-white hover:shadow-md md:gap-4 md:rounded-[1.4rem] md:px-4 md:py-4 ${index === 0 ? "animate-enter-delay-1" : index === 1 ? "animate-enter-delay-2" : "animate-enter-delay-3"}`}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-zinc-900 group-hover:text-white md:h-11 md:w-11">
                            <item.icon className="h-4.5 w-4.5 md:h-5 md:w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{item.label}</span>
                            <span className="mt-0.5 text-[0.92rem] font-medium leading-5 text-zinc-950 md:text-sm">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
