import Link from "next/link"
import { Package, LayoutDashboard, ShoppingCart, Settings, LogOut, Menu } from "lucide-react"
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
    // Links de navegação para reaproveitar no Desktop e Mobile
    const navLinks = [
        { href: "/admin", icon: LayoutDashboard, label: "Início" },
        { href: "/admin/produtos", icon: Package, label: "Produtos" },
        { href: "/admin/pedidos", icon: ShoppingCart, label: "Pedidos" },
        { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
    ];

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            {/* Sidebar Desktop */}
            <div className="hidden border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link href="/admin" className="flex items-center gap-2 font-semibold">
                            <Package className="h-6 w-6" />
                            <span className="">Loja Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900"
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <form action={logout}>
                            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 cursor-pointer transition-all hover:bg-zinc-100 hover:text-red-600">
                                <LogOut className="h-4 w-4" />
                                Sair
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex flex-col">
                {/* Header Mobile */}
                <header className="flex h-14 lg:hidden items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu de navegação</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <SheetTitle className="sr-only">Menu lateral</SheetTitle>
                            <nav className="grid gap-2 text-lg font-medium mt-4">
                                <Link href="/admin" className="flex items-center gap-2 font-bold mb-4">
                                    <Package className="h-6 w-6" />
                                    <span>Loja Admin</span>
                                </Link>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-zinc-500 hover:text-zinc-950"
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto">
                                <form action={logout}>
                                    <button type="submit" className="flex w-full items-center gap-3 rounded-lg py-2 text-zinc-500 cursor-pointer transition-all hover:text-red-600">
                                        <LogOut className="h-5 w-5" />
                                        Sair
                                    </button>
                                </form>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6" />
                        <span className="sr-only">Loja Admin</span>
                    </Link>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
