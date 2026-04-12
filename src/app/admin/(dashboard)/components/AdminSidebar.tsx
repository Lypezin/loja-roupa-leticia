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
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[348px] border-r border-zinc-200/70 bg-[linear-gradient(180deg,rgba(248,244,238,0.94),rgba(244,238,231,0.98))] xl:block">
            <div className="h-full overflow-y-auto px-5 py-6">
                <div className="flex min-h-full flex-col gap-4">
                    <div className="rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.08)]">
                        <Link href="/admin" className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                                <Store className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 space-y-1.5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                                    Painel da loja
                                </p>
                                <p className="text-[1.75rem] leading-none font-semibold tracking-[-0.05em] text-zinc-950">
                                    Operação central
                                </p>
                                <p className="max-w-[15rem] text-[15px] leading-7 text-zinc-600">
                                    Catálogo, pedidos, conteúdo e logística em uma leitura mais clara.
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="rounded-[1.8rem] border border-zinc-200/80 bg-white/85 p-4 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                        <div className="px-2 pb-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Navegação
                            </p>
                            <p className="mt-1 max-w-[16rem] text-sm leading-6 text-zinc-600">
                                Acesse cada área da operação sem perder contexto.
                            </p>
                        </div>

                        <nav className="px-1">
                            <AdminNavLinks links={navLinks} variant="desktop" />
                        </nav>
                    </div>

                    <div className="mt-auto rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                                <ExternalLink className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold">Abrir vitrine</span>
                                <span className="block text-xs text-zinc-500">Ver a loja como cliente</span>
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
                        </Link>

                        <form action={logout} className="mt-1">
                            <button
                                type="submit"
                                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500">
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
            </div>
        </aside>
    )
}
