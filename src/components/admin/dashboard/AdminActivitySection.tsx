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
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                        Atividade Recente
                    </h2>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center">
                    <p className="text-sm text-zinc-600">Nenhuma atividade registrada ainda.</p>
                </div>
            ) : (
                <div className="mt-4 space-y-2">
                    {items.map((item) => {
                        const Icon = iconByKind[item.kind]

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="group flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-zinc-300 hover:bg-white md:flex-row md:items-center md:gap-4"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors group-hover:text-zinc-950">
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-zinc-950">{item.title}</p>
                                        <span
                                            className={cn(
                                                "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                                                badgeToneByKind[item.kind],
                                            )}
                                        >
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
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
