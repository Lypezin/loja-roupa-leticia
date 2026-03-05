import { createClient } from "@/lib/supabase/server"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"

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

    const stats = [
        {
            label: "Vendas no Mês",
            value: "R$ 0,00",
            change: "Gateway pendente",
            icon: DollarSign,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Pedidos",
            value: "0",
            change: "Nenhum ainda",
            icon: ShoppingCart,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Produtos Ativos",
            value: String(productCount || 0),
            change: "No catálogo",
            icon: Package,
            color: "bg-purple-50 text-purple-600",
        },
        {
            label: "Categorias",
            value: String(categoryCount || 0),
            change: "Organizadas",
            icon: TrendingUp,
            color: "bg-amber-50 text-amber-600",
        },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Visão geral da sua loja e métricas rápidas.
                </p>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-zinc-100 p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                        <p className="text-xs text-zinc-400 mt-1">{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Ações Rápidas</h2>
                <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
                    {[
                        { href: "/admin/produtos/novo", emoji: "📦", label: "Novo Produto", desc: "Adicionar ao catálogo" },
                        { href: "/admin/categorias", emoji: "🏷️", label: "Categorias", desc: "Gerenciar categorização" },
                        { href: "/admin/configuracoes", emoji: "⚙️", label: "Configurações", desc: "Perfil e banner da loja" },
                    ].map(action => (
                        <a key={action.href} href={action.href} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all group">
                            <span className="text-2xl">{action.emoji}</span>
                            <div>
                                <p className="font-medium text-zinc-900 group-hover:text-zinc-700 transition-colors">{action.label}</p>
                                <p className="text-xs text-zinc-400">{action.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
