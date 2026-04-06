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
        <div className="flex flex-col justify-center py-2 md:py-4">
            <span className="eyebrow">{badgeText || "capsula atual"}</span>

            <h1 className="mt-5 max-w-3xl font-display text-[3rem] leading-[0.92] text-foreground sm:text-[4rem] md:text-[5.2rem]">
                {title}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                {subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                    href="/produtos"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                    {buttonText}
                </Link>

                {secondaryButtonText && (
                    <Link
                        href="/sobre"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-7 text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-accent"
                    >
                        {secondaryButtonText}
                    </Link>
                )}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                    { label: "Materia", value: "toque atento" },
                    { label: "Entrega", value: "todo o Brasil" },
                    { label: "Troca", value: "assistida" },
                ].map((item) => (
                    <div key={item.label} className="surface-card-soft rounded-[1.3rem] px-4 py-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                ))}
            </div>

            {countdownEnd && (
                <div className="mt-8 max-w-sm rounded-[1.6rem] border border-border bg-card px-5 py-5 shadow-[0_14px_30px_rgba(68,48,31,0.05)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">janela de lancamento</p>
                    <div className="mt-4">
                        <CountdownTimer targetDate={countdownEnd} />
                    </div>
                </div>
            )}
        </div>
    )
}
