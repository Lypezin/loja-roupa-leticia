import Link from "next/link"
import { FolderKanban, Package, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

export type AdminActivityItem = {
    id: string
    kind: "order" | "product" | "category"
    title: string
    description: string
    timestamp: string
    href: string
    badge: string
}

interface AdminActivitySectionProps {
    items: AdminActivityItem[]
}

const iconByKind = {
    order: ShoppingCart,
    product: Package,
    category: FolderKanban,
} as const

const badgeToneByKind = {
    order: "bg-emerald-100 text-emerald-700",
    product: "bg-amber-100 text-amber-800",
    category: "bg-sky-100 text-sky-700",
} as const

function formatActivityDate(value: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value))
}

export function AdminActivitySection({ items }: AdminActivitySectionProps) {
    return (
        <section className="rounded-[1.8rem] border border-zinc-200/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6">
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Últimas Atualizações
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
                    Atividade Recente
                </h2>
            </div>

            {items.length === 0 ? (
                <div className="mt-4 rounded-[1.4rem] border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center">
                    <p className="text-sm text-zinc-600">Nenhuma atividade registrada ainda.</p>
                </div>
            ) : (
                <div className="mt-4 space-y-2.5">
                    {items.map((item) => {
                        const Icon = iconByKind[item.kind]

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="group flex flex-col gap-3 rounded-[1.35rem] border border-zinc-200 bg-zinc-50/70 p-4 transition-colors hover:border-zinc-300 hover:bg-white md:flex-row md:items-center md:gap-4"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 transition-colors group-hover:text-zinc-950">
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-zinc-950">{item.title}</p>
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                                badgeToneByKind[item.kind],
                                            )}
                                        >
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-6 text-zinc-500">{item.description}</p>
                                </div>

                                <span className="shrink-0 text-xs font-medium text-zinc-500 group-hover:text-zinc-700">
                                    {formatActivityDate(item.timestamp)}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
