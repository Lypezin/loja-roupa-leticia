"use client"

import Link from "next/link"
import {
    DollarSign,
    Package,
    PlusCircle,
    Settings,
    ShoppingCart,
    Tags,
} from "lucide-react"

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
        <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{label}</p>
                    <p className="text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            {change ? (
                <p className="mt-4 text-sm leading-6 text-zinc-500">{change}</p>
            ) : null}
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
            <div className="flex h-full flex-col gap-4 rounded-[1.6rem] border border-zinc-200/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-zinc-300 group-hover:text-zinc-950">
                        <Icon className="h-4 w-4" />
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <p className="text-base font-semibold text-zinc-950">{label}</p>
                    <p className="text-sm leading-6 text-zinc-500">{desc}</p>
                </div>
            </div>
        </Link>
    )
}
