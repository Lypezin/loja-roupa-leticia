import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BarChart3, Sparkles } from "lucide-react"
import { AdminActionCard, AdminStatCard, type AdminDashboardIcon } from "@/components/admin/dashboard/AdminCards"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch counts in parallel
    const [
        { count: productCount },
        { count: categoryCount },
        { count: totalProducts }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true })
    ])

    const stats: Array<{
        label: string
        value: string
        change: string
        icon: AdminDashboardIcon
    }> = [
        {
            label: "Vendas no Mês",
            value: "R$ 0,00",
            change: "Gateway pendente",
            icon: "DollarSign",
        },
        {
            label: "Pedidos",
            value: "0",
            change: "Nenhum ainda",
            icon: "ShoppingCart",
        },
        {
            label: "Produtos Ativos",
            value: String(productCount || 0),
            change: `${totalProducts || 0} no total`,
            icon: "Package",
        },
        {
            label: "Categorias",
            value: String(categoryCount || 0),
            change: "Organizadas",
            icon: "Tags",
        },
    ]

    const quickActions: Array<{
        href: string
        icon: AdminDashboardIcon
        label: string
        desc: string
    }> = [
        {
            href: "/admin/produtos/novo",
            icon: "PlusCircle",
            label: "Novo Produto",
            desc: "Adicionar ao catálogo",
        },
        {
            href: "/admin/categorias",
            icon: "Tags",
            label: "Categorias",
            desc: "Gerenciar organização",
        },
        {
            href: "/admin/configuracoes",
            icon: "Settings",
            label: "Configurações",
            desc: "Perfil, banner e conteúdo",
        },
    ]

    return (
        <div className="flex flex-col gap-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
                <div className="absolute inset-0 admin-mesh opacity-80" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Painel Administrativo</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
                        Bem-vindo de volta!
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-lg">
                        Gerencie seus produtos, categorias e configurações da loja. Aqui você tem o controle total da sua vitrine.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <AdminStatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        change={stat.change}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>
                    <Link href="/admin/produtos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Ver todos os produtos →
                    </Link>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {quickActions.map(action => (
                        <AdminActionCard
                            key={action.href}
                            href={action.href}
                            icon={action.icon}
                            label={action.label}
                            desc={action.desc}
                        />
                    ))}
                </div>
            </div>

            {/* Activity Placeholder */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Atividade Recente</h3>
                        <p className="text-xs text-muted-foreground">Últimas ações na loja</p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
                        <p className="text-xs text-muted-foreground/80 mt-1">As atividades aparecerão aqui quando você começar a receber pedidos.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
