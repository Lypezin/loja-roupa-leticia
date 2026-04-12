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
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[312px] border-r border-zinc-200/70 bg-[linear-gradient(180deg,rgba(248,244,238,0.94),rgba(244,238,231,0.98))] lg:block">
            <div className="flex h-full flex-col p-5">
                <div className="rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.08)]">
                    <Link href="/admin" className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                            <Store className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                                Painel da loja
                            </p>
                            <p className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
                                Operação central
                            </p>
                            <p className="text-sm leading-6 text-zinc-600">
                                Catálogo, pedidos, conteúdo e logística em um fluxo mais claro.
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="mt-5 flex flex-1 flex-col overflow-hidden rounded-[1.8rem] border border-zinc-200/80 bg-white/85 p-4 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <div className="px-2 pb-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Navegação
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-600">
                            Cada área da operação com contexto e acesso direto.
                        </p>
                    </div>

                    <nav className="min-h-0 flex-1 overflow-y-auto pr-1">
                        <AdminNavLinks links={navLinks} variant="desktop" />
                    </nav>
                </div>

                <div className="mt-5 rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                            <ExternalLink className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block font-semibold">Abrir vitrine</span>
                            <span className="block text-xs text-zinc-500">Ver a loja como cliente</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                    </Link>

                    <form action={logout} className="mt-1">
                        <button
                            type="submit"
                            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500">
                                <LogOut className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold">Encerrar sessão</span>
                                <span className="block text-xs text-zinc-500">Sair do painel administrativo</span>
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    )
}
