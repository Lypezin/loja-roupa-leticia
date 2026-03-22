'use client'

import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface Category {
    id: string
    name: string
    slug: string
}

interface DesktopNavProps {
    displayCategories: Category[];
    extraCategories: Category[];
}

export function DesktopNav({ displayCategories, extraCategories }: DesktopNavProps) {
    return (
        <nav className="hidden lg:flex items-center gap-1">
            {displayCategories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/${cat.slug}`}
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
                >
                    {cat.name}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2" />
                </Link>
            ))}

            {/* Dropdown menu para mais categorias */}
            {extraCategories.length > 0 && (
                <div className="relative group/dropdown">
                    <button className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted flex items-center gap-1">
                        Mais
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-[&:hover]/dropdown:w-1/2" />
                    </button>

                    <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl opacity-0 invisible group-[&:hover]/dropdown:opacity-100 group-[&:hover]/dropdown:visible transition-all duration-300 transform origin-top-right group-[&:hover]/dropdown:translate-y-0 translate-y-2 z-50">
                        <div className="py-2 flex flex-col">
                            {extraCategories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={`/${cat.slug}`}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="w-px h-4 bg-border mx-2" />

            <Link
                href="/sobre"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
            >
                Sobre
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-1/2" />
            </Link>
        </nav>
    )
}
