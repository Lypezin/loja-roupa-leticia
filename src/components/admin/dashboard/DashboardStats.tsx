'use client'

import { AdminStatCard } from "./AdminCards"

interface Stat {
    label: string
    value: string
    change: string
    icon: "DollarSign" | "ShoppingCart" | "Package" | "Tags"
}

interface DashboardStatsProps {
    stats: Stat[]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <AdminStatCard key={stat.label} {...stat} />
            ))}
        </div>
    )
}
