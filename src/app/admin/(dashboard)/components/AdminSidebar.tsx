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
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white xl:flex">
            <div className="flex h-16 shrink-0 items-center px-6">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-sm">
                        <Store className="h-4 w-4" />
                    </div>
                    <span className="text-[1.125rem] font-semibold tracking-tight text-zinc-950">
                        Admin
                    </span>
                </Link>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                <div className="mb-4 px-2 tracking-wider">
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase">
                        Navegação
                    </p>
                </div>
                
                <nav className="flex-1 space-y-1">
                    <AdminNavLinks links={navLinks} variant="desktop" />
                </nav>

                <div className="mt-auto space-y-1 pt-4">
                    <Link
                        href="/"
                        target="_blank"
                        className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        <ExternalLink className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-900" />
                        <span className="block font-medium">Abrir vitrine</span>
                        <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-zinc-400" />
                    </Link>

                    <form action={logout}>
                        <button
                            type="submit"
                            className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                            <LogOut className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-red-600" />
                            <span className="block font-medium">Sair</span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    )
}
