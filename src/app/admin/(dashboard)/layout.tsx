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
        { href: "/admin/configuracoes", icon: "Settings", label: "Configurações" },
    ];

    return (
        <div data-admin className="grid min-h-screen w-full lg:grid-cols-[260px_1fr] bg-background text-foreground">
            <AdminSidebar navLinks={navLinks} />

            <div className="flex flex-col min-h-screen bg-background">
                <AdminMobileHeader navLinks={navLinks} />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" richColors />
        </div>
    )
}
