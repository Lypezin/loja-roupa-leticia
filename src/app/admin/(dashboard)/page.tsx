import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BarChart3, Sparkles } from "lucide-react"
import { AdminActionCard, AdminStatCard, type AdminDashboardIcon } from "@/components/admin/dashboard/AdminCards"
import { AdminActivitySection } from "@/components/admin/dashboard/AdminActivitySection"
import { getAdminStats } from "./pedidos/actions"
import { formatCurrency } from "@/lib/utils"

export default async function AdminDashboard() {
    const supabase = await createClient()

    const [ { count: prodC }, { count: catC }, { count: totP }, salesData ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        getAdminStats()
    ])

    const stats: any[] = [
        { label: "Vendas no Mês", value: formatCurrency(salesData.totalSales), change: `${salesData.totalOrders} pedido(s)`, icon: "DollarSign" },
        { label: "Pedidos", value: String(salesData.totalOrders), change: "Este mês", icon: "ShoppingCart" },
        { label: "Produtos Ativos", value: String(prodC || 0), change: `${totP || 0} no total`, icon: "Package" },
        { label: "Categorias", value: String(catC || 0), change: "Organizadas", icon: "Tags" },
    ]

    const quickActions: any[] = [
        { href: "/admin/produtos/novo", icon: "PlusCircle", label: "Novo Produto", desc: "Adicionar ao catálogo" },
        { href: "/admin/categorias", icon: "Tags", label: "Categorias", desc: "Gerenciar organização" },
        { href: "/admin/configuracoes", icon: "Settings", label: "Configurações", desc: "Perfil, banner e conteúdo" },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
                <div className="absolute inset-0 admin-mesh opacity-80" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-primary" /><span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Painel Administrativo</span></div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Bem-vindo de volta!</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">Gerencie seus produtos, categorias e configurações da loja. Aqui você tem o controle total da sua vitrine.</p>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => <AdminStatCard key={s.label} {...s} />)}
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>
                    <Link href="/admin/produtos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ver todos os produtos →</Link>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {quickActions.map(a => <AdminActionCard key={a.href} {...a} />)}
                </div>
            </div>

            <AdminActivitySection />
        </div>
    )
}
