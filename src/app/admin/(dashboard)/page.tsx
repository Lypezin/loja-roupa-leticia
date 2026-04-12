import Link from "next/link"
import { AdminActionCard, AdminStatCard } from "@/components/admin/dashboard/AdminCards"
import { AdminActivitySection, type AdminActivityItem } from "@/components/admin/dashboard/AdminActivitySection"
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { formatCurrency } from "@/lib/utils"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { getAdminStats } from "./pedidos/actions"

function getOrderStatusLabel(status: string) {
    switch (status) {
        case "paid":
            return "Pago"
        case "processing":
            return "Processando"
        case "shipped":
            return "Enviado"
        case "delivered":
            return "Entregue"
        case "refunded":
            return "Reembolsado"
        case "cancelled":
            return "Cancelado"
        case "disputed":
            return "Em disputa"
        default:
            return "Pedido"
    }
}

export default async function AdminDashboard() {
    const supabase = createServiceRoleClient("admin-dashboard.page")

    const [
        { count: activeProducts },
        { count: categoriesCount },
        { count: totalProducts },
        salesData,
        { data: recentOrders },
        { data: recentProducts },
        { data: recentCategories },
    ] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        getAdminStats(),
        supabase
            .from("orders")
            .select("id, created_at, customer_name, total_amount, status, payment_method")
            .order("created_at", { ascending: false })
            .limit(4),
        supabase
            .from("products")
            .select("id, name, base_price, is_active, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
        supabase
            .from("categories")
            .select("id, name, slug, created_at")
            .order("created_at", { ascending: false })
            .limit(4),
    ])

    const stats = [
        { label: "Vendas no mês", value: formatCurrency(salesData.totalSales), change: `${salesData.totalOrders} pedido(s) no período`, icon: "DollarSign" as const },
        { label: "Pedidos", value: String(salesData.totalOrders), change: "Fluxo recebido neste mês", icon: "ShoppingCart" as const },
        { label: "Produtos ativos", value: String(activeProducts || 0), change: `${totalProducts || 0} no catálogo`, icon: "Package" as const },
        { label: "Categorias", value: String(categoriesCount || 0), change: "Coleções cadastradas", icon: "Tags" as const },
    ]

    const quickActions = [
        { href: "/admin/produtos/novo", icon: "PlusCircle" as const, label: "Cadastrar produto", desc: "Monte o item completo com imagens, variações e frete." },
        { href: "/admin/categorias", icon: "Tags" as const, label: "Organizar categorias", desc: "Revise coleções, capas e distribuição do catálogo." },
        { href: "/admin/configuracoes", icon: "Settings" as const, label: "Ajustar a loja", desc: "Atualize marca, home, contatos e logística." },
    ]

    const activities: AdminActivityItem[] = [
        ...(recentOrders ?? []).map((order) => ({
            id: `order-${order.id}`,
            kind: "order" as const,
            title: `Pedido #${order.id.slice(0, 8)}`,
            description: `${order.customer_name || "Cliente"} • ${formatCurrency(order.total_amount)}${order.payment_method ? ` via ${order.payment_method}` : ""}`,
            timestamp: order.created_at,
            href: "/admin/pedidos",
            badge: getOrderStatusLabel(order.status),
        })),
        ...(recentProducts ?? [])
            .filter((product) => Boolean(product.created_at))
            .map((product) => ({
                id: `product-${product.id}`,
                kind: "product" as const,
                title: product.name,
                description: `${formatCurrency(product.base_price)} • ${product.is_active ? "Ativo" : "Oculto"}`,
                timestamp: product.created_at!,
                href: `/admin/produtos/${product.id}/editar`,
                badge: "Produto",
            })),
        ...(recentCategories ?? [])
            .filter((category) => Boolean(category.created_at))
            .map((category) => ({
                id: `category-${category.id}`,
                kind: "category" as const,
                title: category.name,
                description: `/${category.slug}`,
                timestamp: category.created_at!,
                href: "/admin/categorias",
                badge: "Categoria",
            })),
    ]
        .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
        .slice(0, 6)

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                eyebrow="Painel administrativo"
                title="Operação da loja mais clara."
                description="Acompanhe o que entrou, o que precisa de ação e onde o catálogo ainda pode ser refinado. O painel agora prioriza leitura rápida e contexto operacional."
                actions={
                    <Link
                        href="/admin/produtos/novo"
                        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                    >
                        Cadastrar produto
                    </Link>
                }
                metrics={[
                    { label: "Vendas do mês", value: formatCurrency(salesData.totalSales), description: `${salesData.totalOrders} pedido(s) confirmados.` },
                    { label: "Catálogo ativo", value: String(activeProducts || 0), description: `${totalProducts || 0} item(ns) cadastrados.` },
                    { label: "Categorias", value: String(categoriesCount || 0), description: "Estrutura da navegação da loja." },
                    { label: "Último foco", value: activities[0]?.badge || "Sem atividade", description: activities[0]?.title || "Nenhuma movimentação recente." },
                ]}
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                {stats.map((stat) => (
                    <AdminStatCard key={stat.label} {...stat} />
                ))}
            </div>

            <section className="rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Fluxos rápidos
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                            Ações mais usadas do dia
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                            Atalhos para catálogo, categorias e identidade da loja sem precisar navegar pelo painel inteiro.
                        </p>
                    </div>
                    <Link href="/admin/produtos" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
                        Ver catálogo completo
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map((action) => (
                        <AdminActionCard key={action.href} {...action} />
                    ))}
                </div>
            </section>

            <AdminActivitySection items={activities} />
        </div>
    )
}
