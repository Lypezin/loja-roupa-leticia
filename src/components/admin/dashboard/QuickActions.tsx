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
        <section className="rounded-[1.8rem] border border-zinc-200/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6">
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Atalhos
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
                    Ações rápidas
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {actions.map((action) => (
                    <AdminActionCard key={action.href} {...action} />
                ))}
            </div>
        </section>
    )
}
