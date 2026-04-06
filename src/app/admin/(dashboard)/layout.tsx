import { Toaster } from "@/components/ui/sonner"
import { type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
import { AdminSidebar } from "./components/AdminSidebar"
import { AdminMobileHeader } from "./components/AdminMobileHeader"
import { requireAdminPage } from "@/lib/supabase/server"

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
        { href: "/admin/configuracoes", icon: "Settings", label: "Configuracoes" },
    ]

    return (
        <div data-admin className="admin-grid grid min-h-screen w-full lg:grid-cols-[260px_1fr] bg-background text-foreground">
            <AdminSidebar navLinks={navLinks} />

            <div className="relative flex min-h-screen flex-col bg-transparent">
                <div className="admin-mesh pointer-events-none absolute inset-0 opacity-70" />
                <AdminMobileHeader navLinks={navLinks} />

                <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" richColors />
        </div>
    )
}
