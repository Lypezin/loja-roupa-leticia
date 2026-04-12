'use client'

import Link from "next/link"
import { ExternalLink, LogOut, Menu, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { logout } from "@/app/admin/login/actions"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"

interface AdminMobileHeaderProps {
    navLinks: AdminNavLink[]
}

export function AdminMobileHeader({ navLinks }: AdminMobileHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white lg:hidden">
            <div className="flex h-16 items-center justify-between gap-3 px-4">
                <Link href="/admin" className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
                        <Store className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-zinc-950">
                            Admin da Loja
                        </span>
                    </span>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-md border-zinc-200 bg-white">
                            <Menu className="h-4 w-4" />
                            <span className="sr-only">Abrir menu do painel</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="flex w-64 flex-col border-zinc-200 bg-white p-4"
                    >
                        <SheetTitle className="sr-only">Menu administrativo</SheetTitle>

                        <div className="flex items-center gap-3 mb-6 mt-2 px-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
                                <Store className="h-4 w-4" />
                            </span>
                            <span className="text-[1.125rem] font-semibold tracking-tight text-zinc-950">
                                Admin
                            </span>
                        </div>

                        <div className="mb-4 px-2 tracking-wider">
                            <p className="text-[11px] font-semibold text-zinc-500 uppercase">
                                Navegação
                            </p>
                        </div>

                        <nav className="flex-1 overflow-y-auto">
                            <AdminNavLinks links={navLinks} variant="mobile" />
                        </nav>

                        <div className="mt-auto space-y-1 pt-4 border-t border-zinc-100">
                            <Link
                                href="/"
                                target="_blank"
                                className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                <ExternalLink className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-900" />
                                <span className="font-medium">Abrir vitrine</span>
                            </Link>

                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                >
                                    <LogOut className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-red-600" />
                                    <span className="font-medium">Sair do painel</span>
                                </button>
                            </form>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
