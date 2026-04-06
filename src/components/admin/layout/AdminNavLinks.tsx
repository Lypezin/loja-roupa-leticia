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
    <div className={cn(variant === "desktop" ? "space-y-1.5" : "flex flex-col gap-1.5")}>
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
              "flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive
                ? "bg-sidebar-accent text-sidebar-foreground shadow-[0_12px_28px_rgba(70,52,35,0.08)]"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/75 hover:text-sidebar-foreground",
            )}
          >
            <Icon className={cn(variant === "mobile" ? "h-5 w-5" : "h-4.5 w-4.5")} />
            {link.label}
            {isActive && (
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
                ativo
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
