'use client'

import { AdminActionCard } from "./AdminCards"

interface Action {
    href: string
    icon: "PlusCircle" | "Tags" | "Settings"
    label: string
    desc: string
}

interface QuickActionsProps {
    actions: Action[]
}

export function QuickActions({ actions }: QuickActionsProps) {
    return (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                        Ações Rápidas
                    </h2>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {actions.map((action) => (
                    <AdminActionCard key={action.href} {...action} />
                ))}
            </div>
        </section>
    )
}
