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
        { href: "/admin", icon: "LayoutDashboard", label: "Dashboard", description: "Visão geral da operação" },
        { href: "/admin/categorias", icon: "Tags", label: "Categorias", description: "Coleções e organização" },
        { href: "/admin/produtos", icon: "Package", label: "Produtos", description: "Catálogo, estoque e imagens" },
        { href: "/admin/pedidos", icon: "ShoppingCart", label: "Pedidos", description: "Pagamento, envio e acompanhamento" },
        { href: "/admin/configuracoes", icon: "Settings", label: "Configurações", description: "Marca, conteúdo e logística" },
    ]

    return (
        <div
            data-admin
            className="min-h-screen bg-[linear-gradient(180deg,rgba(251,249,246,0.96),rgba(245,240,233,0.98))] text-foreground"
        >
            <AdminSidebar navLinks={navLinks} />

            <div className="min-h-screen xl:pl-[348px]">
                <AdminMobileHeader navLinks={navLinks} />

                <main className="px-4 pb-8 pt-4 md:px-6 lg:px-8 lg:py-8">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                        {children}
                    </div>
                </main>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    )
}
