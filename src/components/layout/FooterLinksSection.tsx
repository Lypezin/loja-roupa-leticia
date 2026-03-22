import Link from "next/link"

interface FooterLinksSectionProps {
    title: string;
    links: Array<{ href: string; label: string }>;
}

export function FooterLinksSection({ title, links }: FooterLinksSectionProps) {
    return (
        <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{title}</h4>
            <ul className="space-y-2.5">
                {links.map(link => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-sm hover:text-white transition-colors">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
