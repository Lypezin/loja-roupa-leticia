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
        <section className="page-shell py-6 md:py-10">
            <div className="paper-panel overflow-hidden rounded-[2.4rem] px-6 py-8 md:px-10 md:py-10">
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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
