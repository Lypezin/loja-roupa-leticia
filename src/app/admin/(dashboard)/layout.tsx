import { Toaster } from "@/components/ui/sonner"
import { type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
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
        { href: "/admin/configuracoes", icon: "Settings", label: "Configurações" },
    ]

    return (
        <div data-admin className="grid min-h-screen w-full bg-background text-foreground lg:grid-cols-[256px_1fr]">
            <AdminSidebar navLinks={navLinks} />

            <div className="flex min-h-screen flex-col">
                <AdminMobileHeader navLinks={navLinks} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" richColors />
        </div>
    )
}
