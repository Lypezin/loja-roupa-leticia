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
import { Card, CardContent } from "@/components/ui/card"

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
    <Card className="surface-card rounded-[1.8rem] border-none">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{change}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </CardContent>
    </Card>
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
      <Card className="surface-card rounded-[1.8rem] border-none transition-transform duration-200 group-hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              "bg-primary/10 text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold tracking-tight text-foreground">{label}</p>
            <p className="mt-0.5 text-xs leading-6 text-muted-foreground">{desc}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}
