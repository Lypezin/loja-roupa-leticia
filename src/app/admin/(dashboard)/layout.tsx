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
        <div className="grid min-h-screen w-full lg:grid-cols-[260px_1fr]">
            {/* Sidebar Desktop — Premium Dark */}
            <div className="hidden lg:flex flex-col bg-zinc-950 text-white">
                <div className="flex h-16 items-center gap-3 px-6 border-b border-zinc-800">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-zinc-950" />
                    </div>
                    <Link href="/admin" className="font-bold text-lg tracking-tight">
                        Admin
                    </Link>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 font-medium transition-all hover:text-white hover:bg-zinc-800/60"
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-3 space-y-1 border-t border-zinc-800">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 font-medium transition-all hover:text-white hover:bg-zinc-800/60"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Ver Loja
                        <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
                    </Link>

                    <form action={logout}>
                        <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 cursor-pointer transition-all hover:bg-red-500/10 hover:text-red-400">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                    </form>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex flex-col bg-zinc-50 min-h-screen">
                {/* Header Mobile */}
                <header className="flex h-14 lg:hidden items-center gap-4 border-b bg-white px-4 shadow-sm">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu de navegação</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col bg-zinc-950 text-white border-zinc-800 w-72">
                            <SheetTitle className="sr-only">Menu lateral</SheetTitle>
                            <div className="flex items-center gap-3 mb-6 mt-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <Package className="h-4 w-4 text-zinc-950" />
                                </div>
                                <span className="font-bold text-lg">Admin</span>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 font-medium hover:text-white hover:bg-zinc-800/60 transition-all"
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto space-y-1 border-t border-zinc-800 pt-3">
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all"
                                >
                                    <ExternalLink className="h-5 w-5" />
                                    Ver Loja
                                </Link>
                                <form action={logout}>
                                    <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition-all">
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
        </div>
    )
}
