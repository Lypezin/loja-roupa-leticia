import Link from "next/link"
import { Package, LayoutDashboard, ShoppingCart, Settings, LogOut } from "lucide-react"
import { logout } from "../login/actions"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Início
                            </Link>
                            <Link
                                href="/admin/produtos"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900"
                            >
                                <Package className="h-4 w-4" />
                                Produtos
                            </Link>
                            <Link
                                href="/admin/pedidos"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Pedidos
                            </Link>
                            <Link
                                href="/admin/configuracoes"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900"
                            >
                                <Settings className="h-4 w-4" />
                                Configurações
                            </Link>
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
                {/* Header Mobile Omitido por enquanto p/ simplicidade no rascunho */}
                <header className="flex h-14 lg:hidden items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6" />
                        <span className="sr-only">Loja Admin</span>
                    </Link>
                    {/* Lógica de menu sanduiche entra aqui futuramente */}
                </header>

                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
