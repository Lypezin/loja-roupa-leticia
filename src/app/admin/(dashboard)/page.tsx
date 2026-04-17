import Link from "next/link"
import { reconcilePendingAbacatePayAttempts } from "@/lib/abacatepay/reconcile"
import { AdminActivitySection, type AdminActivityItem } from "@/components/admin/dashboard/AdminActivitySection"
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats"
import { QuickActions } from "@/components/admin/dashboard/QuickActions"
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { formatCurrency } from "@/lib/utils"
import { getAdminStats } from "./pedidos/actions"

function getOrderStatusLabel(status: string) {
    const labels: Record<string, string> = {
        paid: "Pago",
        processing: "Processando",
        shipped: "Enviado",
        delivered: "Entregue",
        refunded: "Reembolsado",
        cancelled: "Cancelado",
        disputed: "Em disputa",
    }

    return labels[status] || "Pedido"
}

export default async function AdminDashboard() {
    const supabase = createServiceRoleClient("admin-dashboard.page")

    try {
        await reconcilePendingAbacatePayAttempts({ limit: 20 })
    } catch (error) {
        console.error("Falha ao reconciliar pagamentos pendentes no dashboard:", error)
    }

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
        supabase.from("orders").select("id, created_at, customer_name, total_amount, status, payment_method").order("created_at", { ascending: false }).limit(4),
        supabase.from("products").select("id, name, base_price, is_active, created_at").order("created_at", { ascending: false }).limit(4),
        supabase.from("categories").select("id, name, slug, created_at").order("created_at", { ascending: false }).limit(4),
    ])

    const stats = [
        { label: "Vendas no mês", value: formatCurrency(salesData.totalSales), change: `${salesData.totalOrders} pedido(s) no período`, icon: "DollarSign" as const },
        { label: "Pedidos", value: String(salesData.totalOrders), change: "Recebidos neste mês", icon: "ShoppingCart" as const },
        { label: "Produtos ativos", value: String(activeProducts || 0), change: `${totalProducts || 0} cadastrados no total`, icon: "Package" as const },
        { label: "Categorias", value: String(categoriesCount || 0), change: "Coleções criadas", icon: "Tags" as const },
    ]

    const quickActions = [
        { href: "/admin/produtos/novo", icon: "PlusCircle" as const, label: "Cadastrar produto", desc: "Adicionar novo item ao catálogo" },
        { href: "/admin/categorias", icon: "Tags" as const, label: "Gerenciar categorias", desc: "Criar e editar coleções" },
        { href: "/admin/configuracoes", icon: "Settings" as const, label: "Ajustar loja", desc: "Configurações gerais da plataforma" },
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
        ...(recentProducts ?? []).filter((product) => Boolean(product.created_at)).map((product) => ({
            id: `product-${product.id}`,
            kind: "product" as const,
            title: product.name,
            description: `${formatCurrency(product.base_price)} • ${product.is_active ? "Ativo" : "Oculto"}`,
            timestamp: product.created_at!,
            href: `/admin/produtos/${product.id}/editar`,
            badge: "Produto",
        })),
        ...(recentCategories ?? []).filter((category) => Boolean(category.created_at)).map((category) => ({
            id: `category-${category.id}`,
            kind: "category" as const,
            title: category.name,
            description: `/${category.slug}`,
            timestamp: category.created_at!,
            href: "/admin/categorias",
            badge: "Categoria",
        })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6)

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                eyebrow="Dashboard"
                title="Resumo da Loja"
                description="Acompanhe suas vendas, seu catálogo e as atividades recentes. Acesse rapidamente as ações mais importantes para o dia a dia da operação."
                actions={
                    <Link
                        href="/admin/produtos/novo"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                    >
                        Novo produto
                    </Link>
                }
            />
            <DashboardStats stats={stats} />
            <QuickActions actions={quickActions} />
            <AdminActivitySection items={activities} />
        </div>
    )
}
