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
        <section className="rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Operação recente
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                        Atividade da loja
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                        Últimos pedidos recebidos, produtos cadastrados e coleções criadas.
                    </p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="mt-6 rounded-[1.4rem] border border-dashed border-zinc-200 bg-zinc-50/70 px-5 py-10 text-center">
                    <p className="text-sm text-zinc-600">Nenhuma atividade registrada ainda.</p>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {items.map((item) => {
                        const Icon = iconByKind[item.kind]

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="group flex flex-col gap-3 rounded-[1.4rem] border border-zinc-200/80 bg-zinc-50/70 p-4 transition-all hover:border-zinc-300 hover:bg-white md:flex-row md:items-center md:gap-4"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-zinc-950">{item.title}</p>
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                                                badgeToneByKind[item.kind],
                                            )}
                                        >
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-6 text-zinc-600">{item.description}</p>
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
