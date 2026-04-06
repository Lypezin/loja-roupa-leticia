import Link from "next/link"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { AdminActionCard, AdminStatCard } from "@/components/admin/dashboard/AdminCards"
import { AdminActivitySection } from "@/components/admin/dashboard/AdminActivitySection"
import { getAdminStats } from "./pedidos/actions"

export default async function AdminDashboard() {
    const supabase = await createClient()

    const [{ count: activeProducts }, { count: categoriesCount }, { count: totalProducts }, salesData] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        getAdminStats(),
    ])

    const stats = [
        { label: "Vendas no mes", value: formatCurrency(salesData.totalSales), change: `${salesData.totalOrders} pedido(s)`, icon: "DollarSign" as const },
        { label: "Pedidos", value: String(salesData.totalOrders), change: "Movimento atual", icon: "ShoppingCart" as const },
        { label: "Produtos ativos", value: String(activeProducts || 0), change: `${totalProducts || 0} no total`, icon: "Package" as const },
        { label: "Categorias", value: String(categoriesCount || 0), change: "Base da navegacao", icon: "Tags" as const },
    ]

    const quickActions = [
        { href: "/admin/produtos/novo", icon: "PlusCircle" as const, label: "Novo produto", desc: "Adicionar uma nova entrada ao catalogo" },
        { href: "/admin/categorias", icon: "Tags" as const, label: "Categorias", desc: "Organizar a leitura da loja" },
        { href: "/admin/configuracoes", icon: "Settings" as const, label: "Configuracoes", desc: "Ajustar conteudo, banner e identidade" },
    ]

    return (
        <div className="flex flex-col gap-8">
            <section className="paper-panel relative overflow-hidden rounded-[2rem] px-6 py-8 md:px-8">
                <div className="absolute inset-0 admin-mesh opacity-90" />
                <div className="absolute inset-0 admin-grid opacity-[0.2]" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">painel administrativo</span>
                    </div>
                    <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Operacao com leitura mais clara.</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                        Menos ruido visual, mais foco no que move a loja: catalogo, pedidos, configuracao e consistencia de marca.
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <AdminStatCard key={stat.label} {...stat} />
                ))}
            </div>

            <section className="surface-card rounded-[1.8rem] p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Acoes rapidas</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Atalhos para o que muda a vitrine com mais frequencia.</p>
                    </div>
                    <Link href="/admin/produtos" className="ink-link">
                        Ver catalogo <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map((action) => (
                        <AdminActionCard key={action.href} {...action} />
                    ))}
                </div>
            </section>

            <AdminActivitySection />
        </div>
    )
}
