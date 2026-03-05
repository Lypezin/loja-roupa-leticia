import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUpRight, Settings, Tags, PlusCircle, BarChart3, Sparkles } from "lucide-react"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Contar produtos ativos
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

    // Contar categorias
    const { count: categoryCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

    // Contar total de produtos
    const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    const stats = [
        {
            label: "Vendas no Mês",
            value: "R$ 0,00",
            change: "Gateway pendente",
            icon: DollarSign,
            gradient: "from-emerald-500 to-teal-600",
            bgLight: "bg-emerald-50",
        },
        {
            label: "Pedidos",
            value: "0",
            change: "Nenhum ainda",
            icon: ShoppingCart,
            gradient: "from-blue-500 to-indigo-600",
            bgLight: "bg-blue-50",
        },
        {
            label: "Produtos Ativos",
            value: String(productCount || 0),
            change: `${totalProducts || 0} no total`,
            icon: Package,
            gradient: "from-violet-500 to-purple-600",
            bgLight: "bg-violet-50",
        },
        {
            label: "Categorias",
            value: String(categoryCount || 0),
            change: "Organizadas",
            icon: Tags,
            gradient: "from-amber-500 to-orange-600",
            bgLight: "bg-amber-50",
        },
    ]

    const quickActions = [
        {
            href: "/admin/produtos/novo",
            icon: PlusCircle,
            label: "Novo Produto",
            desc: "Adicionar ao catálogo",
            gradient: "from-violet-500 to-purple-600",
        },
        {
            href: "/admin/categorias",
            icon: Tags,
            label: "Categorias",
            desc: "Gerenciar organização",
            gradient: "from-blue-500 to-indigo-600",
        },
        {
            href: "/admin/configuracoes",
            icon: Settings,
            label: "Configurações",
            desc: "Perfil, banner e conteúdo",
            gradient: "from-emerald-500 to-teal-600",
        },
    ]

    return (
        <div className="flex flex-col gap-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Painel Administrativo</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Bem-vindo de volta! 👋
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-lg">
                        Gerencie seus produtos, categorias e configurações da loja. Aqui você tem o controle total da sua vitrine.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</p>
                            <p className="text-xs text-zinc-400 mt-1">{stat.change}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-zinc-900">Ações Rápidas</h2>
                    <Link href="/admin/produtos" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors flex items-center gap-1">
                        Ver todos os produtos
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {quickActions.map(action => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-zinc-200 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">{action.label}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{action.desc}</p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Activity Placeholder */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-900">Atividade Recente</h3>
                        <p className="text-xs text-zinc-400">Últimas ações na loja</p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-8 text-zinc-300">
                    <div className="text-center">
                        <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-zinc-400">Nenhuma atividade recente</p>
                        <p className="text-xs text-zinc-300 mt-1">As atividades aparecerão aqui quando você começar a receber pedidos.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
