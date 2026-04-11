"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  DollarSign,
  Package,
  PlusCircle,
  Settings,
  ShoppingCart,
  Tags,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = {
  DollarSign,
  ShoppingCart,
  Package,
  Tags,
  PlusCircle,
  Settings,
} as const

export type AdminDashboardIcon = keyof typeof ICONS

export function AdminStatCard({
  label,
  value,
  change,
  icon,
}: {
  label: string
  value: string
  change: string
  icon: AdminDashboardIcon
}) {
  const Icon = ICONS[icon]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{change}</p>
    </div>
  )
}

export function AdminActionCard({
  href,
  icon,
  label,
  desc,
}: {
  href: string
  icon: AdminDashboardIcon
  label: string
  desc: string
}) {
  const Icon = ICONS[icon]

  return (
    <Link href={href} className="group block">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{desc}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
      </div>
    </Link>
  )
}
