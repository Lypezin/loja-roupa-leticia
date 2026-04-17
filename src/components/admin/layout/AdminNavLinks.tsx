"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Tags,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = {
    LayoutDashboard,
    Tags,
    Package,
    ShoppingCart,
    Settings,
} as const

export type AdminNavLink = {
    href: string
    icon: keyof typeof ICONS
    label: string
    description?: string
}

export function AdminNavLinks({
    links,
    variant,
}: {
    links: AdminNavLink[]
    variant: "desktop" | "mobile"
}) {
    const pathname = usePathname()

    return (
        <div className={cn("flex flex-col gap-2", variant === "desktop" ? "py-1" : "")}>
            {links.map((link) => {
                const isActive =
                    pathname === link.href ||
                    (link.href !== "/admin" && pathname?.startsWith(link.href))

                const Icon = ICONS[link.icon]
                const showDescription = variant === "desktop" && Boolean(link.description)

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "group flex items-start gap-2.5 rounded-[1.2rem] border px-3.5 py-2.5 text-sm transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActive
                                ? "border-zinc-200 bg-zinc-950 text-white shadow-[0_18px_30px_rgba(39,30,24,0.14)]"
                                : "border-transparent bg-transparent text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900",
                        )}
                    >
                        <span
                            className={cn(
                                "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                                isActive
                                    ? "border-white/12 bg-white/10 text-white"
                                    : "border-zinc-200 bg-white text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-900",
                            )}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">
                                {link.label}
                            </span>
                            {showDescription ? (
                                <span
                                    className={cn(
                                        "mt-1 block text-xs leading-5",
                                        isActive ? "text-white/70" : "text-zinc-500",
                                    )}
                                >
                                    {link.description}
                                </span>
                            ) : null}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
