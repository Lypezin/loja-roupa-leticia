import Link from "next/link"
import { Sparkles } from "lucide-react"
import { AdminActionCard, AdminStatCard } from "@/components/admin/dashboard/AdminCards"
import { AdminActivitySection, type AdminActivityItem } from "@/components/admin/dashboard/AdminActivitySection"
import { formatCurrency } from "@/lib/utils"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { getAdminStats } from "./pedidos/actions"

function getOrderStatusLabel(status: string) {
    switch (status) {
        case "paid":
            return "Pedido pago"
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
        { label: "Vendas no m\u00eas", value: formatCurrency(salesData.totalSales), change: `${salesData.totalOrders} pedido(s)`, icon: "DollarSign" as const },
        { label: "Pedidos", value: String(salesData.totalOrders), change: "Movimento do m\u00eas", icon: "ShoppingCart" as const },
        { label: "Produtos ativos", value: String(activeProducts || 0), change: `${totalProducts || 0} no total`, icon: "Package" as const },
        { label: "Categorias", value: String(categoriesCount || 0), change: "Base da navega\u00e7\u00e3o", icon: "Tags" as const },
    ]

    const quickActions = [
        { href: "/admin/produtos/novo", icon: "PlusCircle" as const, label: "Novo produto", desc: "Cadastrar item, varia\u00e7\u00f5es e imagens" },
        { href: "/admin/categorias", icon: "Tags" as const, label: "Categorias", desc: "Organizar cole\u00e7\u00f5es e navega\u00e7\u00e3o da loja" },
        { href: "/admin/configuracoes", icon: "Settings" as const, label: "Configura\u00e7\u00f5es", desc: "Atualizar banner, contatos e rodap\u00e9" },
    ]

    const activities: AdminActivityItem[] = [
        ...(recentOrders ?? []).map((order) => ({
            id: `order-${order.id}`,
            kind: "order" as const,
            title: `${getOrderStatusLabel(order.status)} #${order.id.slice(0, 8)}`,
            description: `${order.customer_name || "Cliente"} \u2022 ${formatCurrency(order.total_amount)}${order.payment_method ? ` via ${order.payment_method}` : ""}`,
            timestamp: order.created_at,
            href: "/admin/pedidos",
            badge: getOrderStatusLabel(order.status),
        })),
        ...(recentProducts ?? [])
            .filter((product) => Boolean(product.created_at))
            .map((product) => ({
                id: `product-${product.id}`,
                kind: "product" as const,
                title: `Produto "${product.name}" cadastrado`,
                description: `${formatCurrency(product.base_price)} \u2022 ${product.is_active ? "J\u00e1 est\u00e1 vis\u00edvel na loja" : "Salvo como oculto"}`,
                timestamp: product.created_at!,
                href: `/admin/produtos/${product.id}/editar`,
                badge: "Produto",
            })),
        ...(recentCategories ?? [])
            .filter((category) => Boolean(category.created_at))
            .map((category) => ({
                id: `category-${category.id}`,
                kind: "category" as const,
                title: `Cole\u00e7\u00e3o "${category.name}" criada`,
                description: `Slug configurado em /${category.slug}`,
                timestamp: category.created_at!,
                href: "/admin/categorias",
                badge: "Categoria",
            })),
    ]
        .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
        .slice(0, 6)

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
                    <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{"Resumo da opera\u00e7\u00e3o da loja."}</h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {"Acompanhe faturamento, pedidos confirmados, produtos ativos e acessos r\u00e1pidos sem perder contexto do que est\u00e1 acontecendo."}
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
                        <h2 className="text-xl font-semibold text-foreground">{"A\u00e7\u00f5es r\u00e1pidas"}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{"Atalhos para cadastro, organiza\u00e7\u00e3o da vitrine e ajustes principais da loja."}</p>
                    </div>
                    <Link href="/admin/produtos" className="ink-link">
                        {"Ver cat\u00e1logo"} <span aria-hidden="true">{"\u2192"}</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map((action) => (
                        <AdminActionCard key={action.href} {...action} />
                    ))}
                </div>
            </section>

            <AdminActivitySection items={activities} />
        </div>
    )
}
