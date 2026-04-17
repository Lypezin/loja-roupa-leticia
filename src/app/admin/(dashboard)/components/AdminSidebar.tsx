'use client'

import Link from "next/link"
import { ArrowUpRight, ExternalLink, LogOut, Store } from "lucide-react"
import { logout } from "@/app/admin/login/actions"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"

interface AdminSidebarProps {
    navLinks: AdminNavLink[]
}

export function AdminSidebar({ navLinks }: AdminSidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-zinc-200/80 bg-white/88 backdrop-blur-xl lg:block">
            <div className="flex h-full min-h-0 flex-col px-4 py-4">
                <Link
                    href="/admin"
                    className="rounded-[1.6rem] border border-zinc-200/80 bg-white/92 px-3 py-3 shadow-[0_18px_40px_rgba(79,55,39,0.05)] transition-colors hover:border-zinc-300"
                >
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                            <Store className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Administração
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
                                Painel da Loja
                            </h2>
                            <p className="mt-1.5 text-xs leading-5 text-zinc-600">
                                Gerencie seus produtos, pedidos e configurações.
                            </p>
                        </div>
                    </div>
                </Link>

                <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-[1.6rem] border border-zinc-200/80 bg-white/92 p-2.5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <div className="px-2 pb-1.5 pt-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Menu Principal
                        </p>
                    </div>

                    <nav className="mt-2 min-h-0 flex-1 overflow-visible pr-1">
                        <AdminNavLinks links={navLinks} variant="desktop" />
                    </nav>
                </div>

                <div className="mt-3 space-y-1.5 rounded-[1.6rem] border border-zinc-200/80 bg-white/92 p-2.5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-[1.2rem] px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-500 transition-colors group-hover:border-zinc-300 group-hover:text-zinc-900">
                            <ExternalLink className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-zinc-950">Abrir vitrine</span>
                            <span className="block text-xs leading-5 text-zinc-500">Ver a loja como cliente</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
                    </Link>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="group flex w-full cursor-pointer items-center gap-3 rounded-[1.2rem] px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-200/80 bg-red-50 text-red-500 transition-colors group-hover:border-red-300 group-hover:text-red-600">
                                <LogOut className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-zinc-950 group-hover:text-red-700">Encerrar sessão</span>
                                <span className="block text-xs leading-5 text-zinc-500 group-hover:text-red-600">Sair do painel</span>
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    )
}
