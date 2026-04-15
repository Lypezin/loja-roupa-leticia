import { HeroBackground } from "./HeroBackground"
import { HeroContent } from "./HeroContent"

interface HeroSectionProps {
    title: string
    subtitle: string
    buttonText: string
    backgroundUrl: string
    badgeText?: string
    secondaryButtonText?: string
}

export function HeroSection({ title, subtitle, buttonText, backgroundUrl, badgeText, secondaryButtonText }: HeroSectionProps) {
    return (
        <section className="page-shell py-4 md:py-10">
            <div className="paper-panel overflow-hidden rounded-[1.9rem] px-4 py-5 sm:px-6 sm:py-7 md:rounded-[2.4rem] md:px-10 md:py-10">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
                    <HeroContent
                        title={title}
                        subtitle={subtitle}
                        buttonText={buttonText}
                        badgeText={badgeText}
                        secondaryButtonText={secondaryButtonText}
                    />
                    <HeroBackground backgroundUrl={backgroundUrl} title={title} />
                </div>
            </div>
        </section>
    )
}
