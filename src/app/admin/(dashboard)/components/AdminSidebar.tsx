'use client'

import Link from "next/link"
import { ChevronRight, ExternalLink, LogOut, Package } from "lucide-react"
import { logout } from "@/app/admin/login/actions"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"

interface AdminSidebarProps {
    navLinks: AdminNavLink[]
    summary: {
        eyebrow: string
        primary: string
        secondary: string
    }
}

export function AdminSidebar({ navLinks, summary }: AdminSidebarProps) {
    return (
        <aside className="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
            <div className="border-b border-sidebar-border px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                        <Package className="h-4.5 w-4.5" />
                    </div>
                    <div>
                        <Link href="/admin" className="font-display text-3xl leading-none text-sidebar-foreground">
                            Admin
                        </Link>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/45">{"opera\u00e7\u00e3o da loja"}</p>
                    </div>
                </div>

                <div className="mt-6 rounded-[1.4rem] border border-sidebar-border bg-white/55 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/45">{summary.eyebrow}</p>
                    <p className="mt-2 text-sm leading-6 text-sidebar-foreground/76">
                        {summary.primary}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-sidebar-foreground/58">
                        {summary.secondary}
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
                    className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-medium text-sidebar-foreground/72 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                    <ExternalLink className="h-4 w-4" />
                    Ver loja
                    <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                </Link>

                <form action={logout}>
                    <button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-[1rem] px-3 py-3 text-sm text-sidebar-foreground/65 transition-colors hover:bg-red-50 hover:text-red-600">
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </form>
            </div>
        </aside>
    )
}
