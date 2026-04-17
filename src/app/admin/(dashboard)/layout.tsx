import { type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
import { requireAdminPage } from "@/lib/supabase/server"
import { AdminMobileHeader } from "./components/AdminMobileHeader"
import { AdminSidebar } from "./components/AdminSidebar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireAdminPage()

    const navLinks: AdminNavLink[] = [
        { href: "/admin", icon: "LayoutDashboard", label: "Dashboard", description: "Visão geral da loja" },
        { href: "/admin/categorias", icon: "Tags", label: "Categorias", description: "Gerenciar coleções" },
        { href: "/admin/produtos", icon: "Package", label: "Produtos", description: "Catálogo e estoque" },
        { href: "/admin/pedidos", icon: "ShoppingCart", label: "Pedidos", description: "Acompanhar vendas" },
        { href: "/admin/configuracoes", icon: "Settings", label: "Configurações", description: "Ajustes gerais" },
    ]

    return (
        <div
            data-admin
            className="min-h-screen bg-[linear-gradient(180deg,rgba(251,249,246,0.98),rgba(244,239,232,0.98))] text-zinc-950"
        >
            <AdminSidebar navLinks={navLinks} />

            <div className="min-h-screen lg:pl-72">
                <AdminMobileHeader navLinks={navLinks} />

                <main className="px-4 pb-8 pt-4 md:px-6 lg:px-8 lg:py-8">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
