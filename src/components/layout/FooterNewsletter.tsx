interface FooterNewsletterProps {
    title: string
    subtitle: string
}

export function FooterNewsletter({ title, subtitle }: FooterNewsletterProps) {
    return (
        <div className="border-b border-border/70">
            <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
                <div>
                    <span className="eyebrow">edicao semanal</span>
                    <h3 className="mt-4 font-display text-3xl text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{subtitle}</p>
                </div>
                <form className="flex w-full flex-col gap-2 xs:flex-row xs:gap-0 md:w-auto">
                    <input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        className="h-12 flex-1 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 xs:w-72 xs:rounded-r-none"
                    />
                    <button className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 xs:rounded-l-none">
                        Inscrever
                    </button>
                </form>
            </div>
        </div>
    )
}
