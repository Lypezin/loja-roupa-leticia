import Link from "next/link"
import { AdminActionCard, AdminStatCard } from "@/components/admin/dashboard/AdminCards"
import { AdminActivitySection, type AdminActivityItem } from "@/components/admin/dashboard/AdminActivitySection"
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
        { label: "Vendas no mês", value: formatCurrency(salesData.totalSales), change: `${salesData.totalOrders} pedido(s)`, icon: "DollarSign" as const },
        { label: "Pedidos", value: String(salesData.totalOrders), change: "Neste mês", icon: "ShoppingCart" as const },
        { label: "Produtos ativos", value: String(activeProducts || 0), change: `${totalProducts || 0} no total`, icon: "Package" as const },
        { label: "Categorias", value: String(categoriesCount || 0), change: "Cadastradas", icon: "Tags" as const },
    ]

    const quickActions = [
        { href: "/admin/produtos/novo", icon: "PlusCircle" as const, label: "Novo produto", desc: "Cadastrar item com variações e imagens" },
        { href: "/admin/categorias", icon: "Tags" as const, label: "Categorias", desc: "Organizar coleções da loja" },
        { href: "/admin/configuracoes", icon: "Settings" as const, label: "Configurações", desc: "Banner, contatos e rodapé" },
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
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Visão geral de vendas, produtos e atividade recente.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <AdminStatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-foreground">Ações rápidas</h2>
                    <Link href="/admin/produtos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        Ver catálogo →
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {quickActions.map((action) => (
                        <AdminActionCard key={action.href} {...action} />
                    ))}
                </div>
            </div>

            <AdminActivitySection items={activities} />
        </div>
    )
}
