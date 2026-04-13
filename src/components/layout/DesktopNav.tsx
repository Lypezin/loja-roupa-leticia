'use client'

import Link from "next/link"
import { ChevronDown, ArrowRight } from "lucide-react"

interface Category {
    id: string
    name: string
    slug: string
}

interface DesktopNavProps {
    displayCategories: Category[]
    extraCategories: Category[]
}

export function DesktopNav({ displayCategories, extraCategories }: DesktopNavProps) {
    return (
        <nav aria-label="Categorias principais" className="hidden lg:flex items-center gap-1 rounded-full border border-border/80 bg-card/90 px-2 py-1 shadow-[0_12px_28px_rgba(70,52,35,0.05)]">
            {displayCategories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/${cat.slug}`}
                    className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    {cat.name}
                </Link>
            ))}

            {extraCategories.length > 0 && (
                <div className="group/dropdown relative">
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground focus:outline-none"
                    >
                        Mais
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <div className="invisible absolute right-0 top-full z-50 mt-3 min-w-[13rem] translate-y-2 rounded-[1.4rem] border border-border bg-background p-2 opacity-0 shadow-[0_24px_55px_rgba(70,52,35,0.1)] transition-all duration-200 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 group-hover/dropdown:opacity-100 group-focus-within/dropdown:visible group-focus-within/dropdown:translate-y-0 group-focus-within/dropdown:opacity-100">
                        <div className="flex flex-col py-1">
                            {extraCategories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/${cat.slug}`}
                                    role="menuitem"
                                    className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-border pt-1 mt-1">
                            <Link
                                href="/produtos"
                                role="menuitem"
                                className="flex items-center justify-between gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                            >
                                Ver tudo <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-2 h-4 w-px bg-border" />

            <Link
                href="/sobre"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
                Sobre
            </Link>
        </nav>
    )
}
