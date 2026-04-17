'use client'

import Link from "next/link"
import { ExternalLink, LogOut, Menu, Store } from "lucide-react"
import { logout } from "@/app/admin/login/actions"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface AdminMobileHeaderProps {
    navLinks: AdminNavLink[]
}

export function AdminMobileHeader({ navLinks }: AdminMobileHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/88 backdrop-blur-xl lg:hidden">
            <div className="flex h-16 items-center justify-between gap-3 px-4">
                <Link href="/admin" className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                        <Store className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-zinc-950">
                            Painel da loja
                        </span>
                        <span className="block truncate text-xs text-zinc-500">
                            Operação central
                        </span>
                    </span>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-2xl border-zinc-200 bg-white">
                            <Menu className="h-4 w-4" />
                            <span className="sr-only">Abrir menu do painel</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="flex w-[20rem] max-w-[88vw] flex-col border-zinc-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,241,0.98))] p-4"
                    >
                        <SheetTitle className="sr-only">Menu administrativo</SheetTitle>

                        <div className="mt-2 rounded-[1.6rem] border border-zinc-200/80 bg-white/92 px-4 py-4 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                            <div className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                                    <Store className="h-4.5 w-4.5" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                        Painel da loja
                                    </span>
                                    <span className="mt-2 block text-[1.5rem] font-semibold tracking-[-0.05em] text-zinc-950">
                                        Operação central
                                    </span>
                                    <span className="mt-2 block text-sm leading-6 text-zinc-600">
                                        Catálogo, pedidos, conteúdo e logística em um fluxo mais claro.
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="mb-3 mt-5 px-2 tracking-wider">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Navegação
                            </p>
                        </div>

                        <nav className="flex-1 overflow-y-auto pr-1">
                            <AdminNavLinks links={navLinks} variant="mobile" />
                        </nav>

                        <div className="mt-auto space-y-2 border-t border-zinc-100 pt-4">
                            <Link
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 rounded-[1.2rem] px-3 py-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500">
                                    <ExternalLink className="h-4 w-4" />
                                </span>
                                <span className="font-medium">Abrir vitrine</span>
                            </Link>

                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="group flex w-full cursor-pointer items-center gap-3 rounded-[1.2rem] px-3 py-3 text-left text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-200/80 bg-red-50 text-red-500">
                                        <LogOut className="h-4 w-4" />
                                    </span>
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
