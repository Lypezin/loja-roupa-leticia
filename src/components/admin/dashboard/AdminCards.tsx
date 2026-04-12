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
    change?: string
    icon: AdminDashboardIcon
}) {
    const Icon = ICONS[icon]

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-500">{label}</p>
                    <p className="text-2xl font-bold tracking-tight text-zinc-950">{value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            {change && (
                <p className="mt-4 text-xs text-zinc-500">{change}</p>
            )}
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
        <Link href={href} className="group block h-full">
            <div className="flex h-full flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:bg-zinc-50">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-zinc-300 group-hover:text-zinc-950">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>

                <div className="space-y-1.5 flex-1">
                    <p className="text-sm font-semibold text-zinc-950">{label}</p>
                    <p className="text-sm text-zinc-500">{desc}</p>
                </div>
            </div>
        </Link>
    )
}
