import Link from "next/link"
import { Package, LayoutDashboard, ShoppingCart, Settings, LogOut, Menu, ExternalLink, Tags, ChevronRight } from "lucide-react"
import { logout } from "../login/actions"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/sonner"
import { AdminNavLinks } from "@/components/admin/layout/AdminNavLinks"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navLinks = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/categorias", icon: Tags, label: "Categorias" },
        { href: "/admin/produtos", icon: Package, label: "Produtos" },
        { href: "/admin/pedidos", icon: ShoppingCart, label: "Pedidos" },
        { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
    ];

    return (
        <div data-admin className="grid min-h-screen w-full lg:grid-cols-[260px_1fr] bg-background text-foreground">
            {/* Sidebar Desktop — Premium Dark */}
            <div className="hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
                <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
                    <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center shadow-sm">
                        <Package className="h-4 w-4 text-sidebar-primary-foreground" />
                    </div>
                    <Link href="/admin" className="font-bold text-lg tracking-tight">
                        Admin
                    </Link>
                </div>

                <nav className="flex-1 py-4 px-3">
                    <AdminNavLinks links={navLinks} variant="desktop" />
                </nav>

                <div className="p-3 space-y-1 border-t border-sidebar-border">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/70 font-medium transition-all hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Ver Loja
                        <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
                    </Link>

                    <form action={logout}>
                        <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/60 cursor-pointer transition-all hover:bg-red-500/10 hover:text-red-300">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                    </form>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex flex-col min-h-screen bg-background">
                {/* Header Mobile */}
                <header className="flex h-14 lg:hidden items-center gap-4 border-b border-border bg-card px-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu de navegação</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground border-sidebar-border w-72">
                            <SheetTitle className="sr-only">Menu lateral</SheetTitle>
                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                                    <Package className="h-4 w-4 text-sidebar-primary-foreground" />
                                </div>
                                <span className="font-bold text-lg">Admin</span>
                            </div>
                            <nav className="flex flex-col gap-1">
                                <AdminNavLinks links={navLinks} variant="mobile" />
                            </nav>

                            <div className="mt-auto space-y-1 border-t border-sidebar-border pt-3">
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
                                >
                                    <ExternalLink className="h-5 w-5" />
                                    Ver Loja
                                </Link>
                                <form action={logout}>
                                    <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/60 cursor-pointer hover:bg-red-500/10 hover:text-red-300 transition-all">
                                        <LogOut className="h-5 w-5" />
                                        Sair
                                    </button>
                                </form>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/admin" className="flex items-center gap-2 font-bold">
                        <Package className="h-5 w-5" />
                        Admin
                    </Link>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" richColors />
        </div>
    )
}
