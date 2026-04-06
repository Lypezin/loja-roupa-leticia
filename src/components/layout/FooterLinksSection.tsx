import Link from "next/link"

interface FooterLinksSectionProps {
    title: string
    links: Array<{ href: string; label: string }>
}

export function FooterLinksSection({ title, links }: FooterLinksSectionProps) {
    return (
        <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{title}</h4>
            <ul className="space-y-2.5">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-sm text-foreground/78 transition-colors hover:text-foreground">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
