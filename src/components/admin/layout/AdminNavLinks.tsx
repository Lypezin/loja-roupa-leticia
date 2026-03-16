"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Tags,
  Package,
  ShoppingCart,
  Settings,
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
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive
                ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            <Icon className={cn(variant === "mobile" ? "h-5 w-5" : "h-4 w-4")} />
            {link.label}
            {isActive && (
              <span className="ml-auto h-2 w-2 rounded-full bg-sidebar-primary" />
            )}
          </Link>
        )
      })}
    </div>
  )
}

