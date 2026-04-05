"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Package,
  Tags,
  PlusCircle,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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
    <Card className="relative overflow-hidden rounded-[1.8rem] border-white/45 bg-white/75 shadow-[0_20px_50px_rgba(63,42,122,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(63,42,122,0.14)] dark:border-white/10 dark:bg-white/[0.04]">
      <div className="pointer-events-none absolute inset-0 admin-mesh opacity-70" />
      <div className="pointer-events-none absolute inset-0 admin-grid opacity-[0.22]" />
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{change}</p>
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
      <Card className="relative overflow-hidden rounded-[1.8rem] border-white/45 bg-white/78 shadow-[0_18px_45px_rgba(63,42,122,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_55px_rgba(63,42,122,0.14)] dark:border-white/10 dark:bg-white/[0.04]">
        <div className="pointer-events-none absolute inset-0 admin-mesh opacity-50 transition-opacity duration-300 group-hover:opacity-80" />
        <CardContent className="relative flex items-center gap-4 p-5">
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl",
              "bg-primary text-primary-foreground shadow-sm shadow-primary/20",
              "transition-transform duration-300 group-hover:scale-105",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
              {label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground/70" />
        </CardContent>
      </Card>
    </Link>
  )
}
