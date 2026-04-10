import Link from "next/link"
import { BarChart3, FolderKanban, Package, ShoppingCart } from "lucide-react"
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
        <div className="surface-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BarChart3 className="h-4.5 w-4.5" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-foreground">Atividade recente</h3>
                    <p className="text-xs text-muted-foreground">{"\u00daltimos pedidos, produtos e categorias criados no painel."}</p>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="mt-6 rounded-[1.4rem] border border-border bg-card px-5 py-8 text-center">
                    <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-4 text-sm font-medium text-foreground">Nada novo por aqui ainda</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Assim que entrarem pedidos ou novos cadastros, este bloco passa a refletir o movimento da loja.
                    </p>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {items.map((item) => {
                        const Icon = iconByKind[item.kind]

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="flex items-start gap-4 rounded-[1.35rem] border border-border bg-card px-4 py-4 transition-colors hover:border-primary/25 hover:bg-primary/5"
                            >
                                <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="h-4.5 w-4.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                        <span
                                            className={cn(
                                                "inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                                                badgeToneByKind[item.kind]
                                            )}
                                        >
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                                    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                        {formatActivityDate(item.timestamp)}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
