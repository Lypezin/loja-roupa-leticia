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
    <div className={cn(variant === "desktop" ? "space-y-1" : "flex flex-col gap-1")}>
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
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
