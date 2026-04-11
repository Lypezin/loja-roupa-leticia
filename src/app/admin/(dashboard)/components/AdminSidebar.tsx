'use client'

import Link from "next/link"
import { ChevronRight, ExternalLink, LogOut, Store } from "lucide-react"
import { logout } from "@/app/admin/login/actions"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"

interface AdminSidebarProps {
    navLinks: AdminNavLink[]
}

export function AdminSidebar({ navLinks }: AdminSidebarProps) {
    return (
        <aside className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
            <div className="border-b border-sidebar-border px-5 py-5">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <Store className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-sidebar-foreground">Painel Admin</p>
                        <p className="text-[11px] text-sidebar-foreground/50">Gerenciamento da loja</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-3 py-3">
                <AdminNavLinks links={navLinks} variant="desktop" />
            </nav>

            <div className="space-y-0.5 border-t border-sidebar-border p-3">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                    <ExternalLink className="h-4 w-4" />
                    Ver loja
                    <ChevronRight className="ml-auto h-3 w-3 opacity-40" />
                </Link>

                <form action={logout}>
                    <button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600">
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </form>
            </div>
        </aside>
    )
}
