'use client'

import Link from "next/link"
import { Package, ExternalLink, ChevronRight, LogOut } from "lucide-react"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
import { logout } from "@/app/admin/login/actions"

interface AdminSidebarProps {
    navLinks: AdminNavLink[]
}

export function AdminSidebar({ navLinks }: AdminSidebarProps) {
    return (
        <div className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
            <div className="border-b border-sidebar-border px-6 py-6">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-primary shadow-sm shadow-sidebar-primary/30">
                        <Package className="h-4 w-4 text-sidebar-primary-foreground" />
                    </div>
                    <div>
                        <Link href="/admin" className="text-lg font-bold tracking-tight">
                            Admin
                        </Link>
                        <p className="text-xs uppercase tracking-[0.22em] text-sidebar-foreground/45">Controle da loja</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/45">Painel</p>
                    <p className="mt-2 text-sm leading-relaxed text-sidebar-foreground/70">
                        Catalogo, pedidos e identidade visual em um fluxo mais claro.
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4">
                <AdminNavLinks links={navLinks} variant="desktop" />
            </nav>

            <div className="space-y-1 border-t border-sidebar-border p-3">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                >
                    <ExternalLink className="h-4 w-4" />
                    Ver Loja
                    <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                </Link>

                <form action={logout}>
                    <button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm text-sidebar-foreground/60 transition-all hover:bg-red-500/10 hover:text-red-300">
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </form>
            </div>
        </div>
    )
}
