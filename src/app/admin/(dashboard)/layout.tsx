import { Toaster } from "@/components/ui/sonner"
import { type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminPage } from "@/lib/supabase/server"
import { AdminMobileHeader } from "./components/AdminMobileHeader"
import { AdminSidebar } from "./components/AdminSidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireAdminPage()

    const navLinks: AdminNavLink[] = [
        { href: "/admin", icon: "LayoutDashboard", label: "Dashboard" },
        { href: "/admin/categorias", icon: "Tags", label: "Categorias" },
        { href: "/admin/produtos", icon: "Package", label: "Produtos" },
        { href: "/admin/pedidos", icon: "ShoppingCart", label: "Pedidos" },
        { href: "/admin/configuracoes", icon: "Settings", label: "Configura\u00e7\u00f5es" },
    ]

    const supabase = createServiceRoleClient("admin-layout.summary")
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
        { count: activeProducts },
        { count: categoriesCount },
        { count: monthlyOrders },
    ] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .gte("created_at", firstDayOfMonth)
            .neq("status", "cancelled")
            .neq("status", "disputed")
            .neq("status", "refunded"),
    ])

    const summary = {
        eyebrow: "Resumo r\u00e1pido",
        primary: `${activeProducts || 0} produto(s) ativos e ${monthlyOrders || 0} pedido(s) v\u00e1lidos neste m\u00eas.`,
        secondary: `${categoriesCount || 0} categoria(s) ajudam a organizar a navega\u00e7\u00e3o da vitrine.`,
    }

    return (
        <div data-admin className="admin-grid grid min-h-screen w-full bg-background text-foreground lg:grid-cols-[260px_1fr]">
            <AdminSidebar navLinks={navLinks} summary={summary} />

            <div className="relative flex min-h-screen flex-col bg-transparent">
                <div className="admin-mesh pointer-events-none absolute inset-0 opacity-70" />
                <AdminMobileHeader navLinks={navLinks} summary={summary} />

                <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" richColors />
        </div>
    )
}
