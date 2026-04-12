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
        <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                    <p className="text-3xl font-semibold tracking-[-0.05em] text-zinc-950">{value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600">{change}</p>
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
            <div className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-zinc-200/80 bg-white/90 p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_24px_50px_rgba(79,55,39,0.08)]">
                <div className="flex items-start justify-between gap-4">
                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors group-hover:bg-zinc-950 group-hover:text-white",
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900" />
                </div>

                <div className="space-y-2">
                    <p className="text-base font-semibold tracking-[-0.03em] text-zinc-950">{label}</p>
                    <p className="text-sm leading-6 text-zinc-600">{desc}</p>
                </div>
            </div>
        </Link>
    )
}
