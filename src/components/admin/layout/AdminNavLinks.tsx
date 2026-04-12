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
        <div className={cn("flex flex-col gap-1", variant === "desktop" ? "py-1" : "")}>
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
                            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActive
                                ? "bg-zinc-100 text-zinc-900"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                        )}
                    >
                        <Icon 
                            className={cn(
                                "h-4 w-4 shrink-0 transition-colors",
                                isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"
                            )} 
                        />
                        {link.label}
                    </Link>
                )
            })}
        </div>
    )
}
