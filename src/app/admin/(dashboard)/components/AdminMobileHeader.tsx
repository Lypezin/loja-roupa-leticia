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
        <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-[rgba(251,249,246,0.92)] backdrop-blur lg:hidden">
            <div className="flex h-16 items-center justify-between gap-3 px-4">
                <Link href="/admin" className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                        <Store className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Painel
                        </span>
                        <span className="block truncate text-sm font-semibold text-zinc-950">
                            Administração da loja
                        </span>
                    </span>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl border-zinc-200 bg-white">
                            <Menu className="h-4 w-4" />
                            <span className="sr-only">Abrir menu do painel</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="flex w-[88vw] max-w-sm flex-col border-zinc-200 bg-[linear-gradient(180deg,rgba(248,244,238,0.98),rgba(244,238,231,0.98))] p-4"
                    >
                        <SheetTitle className="sr-only">Menu administrativo</SheetTitle>

                        <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-4 shadow-[0_18px_40px_rgba(79,55,39,0.08)]">
                            <div className="flex items-start gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                                    <Store className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                                        Painel administrativo
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-zinc-950">
                                        Operação central da loja
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-zinc-600">
                                        Navegue por catálogo, pedidos, conteúdo e logística.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <nav className="mt-4 flex-1 overflow-y-auto rounded-[1.6rem] border border-zinc-200/80 bg-white/85 p-3 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                            <AdminNavLinks links={navLinks} variant="mobile" />
                        </nav>

                        <div className="mt-4 rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                            <Link
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                                    <ExternalLink className="h-4 w-4" />
                                </span>
                                <span className="font-semibold">Abrir vitrine</span>
                            </Link>

                            <form action={logout} className="mt-1">
                                <button
                                    type="submit"
                                    className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500">
                                        <LogOut className="h-4 w-4" />
                                    </span>
                                    <span className="font-semibold">Sair do painel</span>
                                </button>
                            </form>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
