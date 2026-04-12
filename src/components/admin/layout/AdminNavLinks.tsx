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

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "group flex items-center gap-3 rounded-[1.2rem] border px-3.5 py-3.5 transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                            isActive
                                ? "border-zinc-200 bg-white text-zinc-950 shadow-[0_18px_35px_rgba(70,48,34,0.08)]"
                                : "border-transparent text-zinc-600 hover:border-zinc-200/80 hover:bg-white/80 hover:text-zinc-950",
                        )}
                    >
                        <span
                            className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                                isActive
                                    ? "border-zinc-200 bg-zinc-950 text-white"
                                    : "border-zinc-200/80 bg-zinc-50 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-900",
                            )}
                        >
                            <Icon className="h-4 w-4" />
                        </span>

                            <span className="min-w-0 flex-1 pr-1">
                                <span className="block text-sm font-semibold">{link.label}</span>
                            {link.description ? (
                                <span className="mt-1 block text-[13px] leading-5 text-zinc-500">
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
