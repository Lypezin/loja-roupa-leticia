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
    order: "bg-emerald-50 text-emerald-700",
    product: "bg-amber-50 text-amber-700",
    category: "bg-sky-50 text-sky-700",
} as const

function formatActivityDate(value: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value))
}

export function AdminActivitySection({ items }: AdminActivitySectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">Atividade recente</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Últimos pedidos, produtos e categorias.</p>

            {items.length === 0 ? (
                <div className="mt-5 rounded-lg border border-dashed border-border px-5 py-8 text-center">
                    <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
                </div>
            ) : (
                <div className="mt-4 divide-y divide-border">
                    {items.map((item) => {
                        const Icon = iconByKind[item.kind]

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded-lg first:pt-0"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span
                                        className={cn(
                                            "inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium",
                                            badgeToneByKind[item.kind]
                                        )}
                                    >
                                        {item.badge}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        {formatActivityDate(item.timestamp)}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
