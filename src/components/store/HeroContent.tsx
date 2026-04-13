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
        <div className="flex flex-col justify-center py-2 md:py-4">
            <span className="eyebrow animate-enter-soft">{badgeText || "novidades da semana"}</span>

            <h1 className="animate-enter-soft animate-enter-delay-1 mt-5 max-w-3xl font-display text-[3rem] leading-[0.92] text-foreground sm:text-[4rem] md:text-[5.2rem]">
                {title}
            </h1>

            <p className="animate-enter-soft animate-enter-delay-1 mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                {subtitle}
            </p>

            <div className="animate-enter-soft animate-enter-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                    href="/produtos"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                >
                    {buttonText}
                </Link>

                {secondaryButtonText && (
                    <Link
                        href="/sobre"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {secondaryButtonText}
                    </Link>
                )}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {heroFacts.map((item, index) => (
                    <div
                        key={item.label}
                        className={`group animate-enter-soft flex items-center gap-4 rounded-[1.4rem] border border-zinc-200/60 bg-white/60 px-4 py-4 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-zinc-300 hover:bg-white hover:shadow-md ${index === 0 ? "animate-enter-delay-1" : index === 1 ? "animate-enter-delay-2" : "animate-enter-delay-3"}`}
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                            <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{item.label}</span>
                            <span className="mt-0.5 text-sm font-medium text-zinc-950">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
