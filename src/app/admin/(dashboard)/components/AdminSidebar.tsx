'use client'

import Link from "next/link"
import { Package, ExternalLink, ChevronRight, LogOut } from "lucide-react"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
import { logout } from "@/app/admin/login/actions"

interface AdminSidebarProps {
    navLinks: AdminNavLink[];
}

export function AdminSidebar({ navLinks }: AdminSidebarProps) {
    return (
        <div className="hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
                <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center shadow-sm">
                    <Package className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                <Link href="/admin" className="font-bold text-lg tracking-tight">
                    Admin
                </Link>
            </div>

            <nav className="flex-1 py-4 px-3">
                <AdminNavLinks links={navLinks} variant="desktop" />
            </nav>

            <div className="p-3 space-y-1 border-t border-sidebar-border">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/70 font-medium transition-all hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                >
                    <ExternalLink className="h-4 w-4" />
                    Ver Loja
                    <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
                </Link>

                <form action={logout}>
                    <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/60 cursor-pointer transition-all hover:bg-red-500/10 hover:text-red-300">
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </form>
            </div>
        </div>
    )
}
