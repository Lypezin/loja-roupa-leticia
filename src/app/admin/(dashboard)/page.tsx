import Link from "next/link"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { AdminActionCard, AdminStatCard } from "@/components/admin/dashboard/AdminCards"
import { AdminActivitySection } from "@/components/admin/dashboard/AdminActivitySection"
import { getAdminStats } from "./pedidos/actions"

export default async function AdminDashboard() {
    const supabase = await createClient()

    const [{ count: prodC }, { count: catC }, { count: totP }, salesData] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        getAdminStats()
    ])

    const stats = [
        { label: "Vendas no Mes", value: formatCurrency(salesData.totalSales), change: `${salesData.totalOrders} pedido(s)`, icon: "DollarSign" as const },
        { label: "Pedidos", value: String(salesData.totalOrders), change: "Este mes", icon: "ShoppingCart" as const },
        { label: "Produtos Ativos", value: String(prodC || 0), change: `${totP || 0} no total`, icon: "Package" as const },
        { label: "Categorias", value: String(catC || 0), change: "Organizadas", icon: "Tags" as const },
    ]

    const quickActions = [
        { href: "/admin/produtos/novo", icon: "PlusCircle" as const, label: "Novo Produto", desc: "Adicionar ao catalogo" },
        { href: "/admin/categorias", icon: "Tags" as const, label: "Categorias", desc: "Gerenciar organizacao" },
        { href: "/admin/configuracoes", icon: "Settings" as const, label: "Configuracoes", desc: "Perfil, banner e conteudo" },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-card p-8 shadow-[0_24px_60px_rgba(73,47,140,0.12)]">
                <div className="absolute inset-0 admin-mesh opacity-90" />
                <div className="absolute inset-0 admin-grid opacity-[0.18]" />
                <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Painel Administrativo</span>
                    </div>
                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Operacao, curadoria e narrativa visual.</h1>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">O painel agora assume uma linguagem mais forte e mais clara: leitura rapida para operacao, mas com presenca visual consistente com a loja.</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <span className="rounded-full bg-white/60 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/70">Catalogo vivo</span>
                        <span className="rounded-full bg-white/60 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/70">Pedidos em foco</span>
                        <span className="rounded-full bg-white/60 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/70">Configuracao centralizada</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((s) => <AdminStatCard key={s.label} {...s} />)}
            </div>

            <div className="rounded-[2rem] border border-white/40 bg-card/80 p-6 shadow-[0_20px_50px_rgba(73,47,140,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Acoes Rapidas</h2>
                    <Link href="/admin/produtos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Ver todos os produtos →</Link>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map((a) => <AdminActionCard key={a.href} {...a} />)}
                </div>
            </div>

            <AdminActivitySection />
        </div>
    )
}
