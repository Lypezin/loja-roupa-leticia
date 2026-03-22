'use client'

import Link from "next/link"
import { Menu, Package, ExternalLink, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { AdminNavLinks, type AdminNavLink } from "@/components/admin/layout/AdminNavLinks"
import { logout } from "@/app/admin/login/actions"

interface AdminMobileHeaderProps {
    navLinks: AdminNavLink[];
}

export function AdminMobileHeader({ navLinks }: AdminMobileHeaderProps) {
    return (
        <header className="flex h-14 lg:hidden items-center gap-4 border-b border-border bg-card px-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu de navegação</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground border-sidebar-border w-72">
                    <SheetTitle className="sr-only">Menu lateral</SheetTitle>
                    <div className="flex items-center gap-3 mb-6 mt-2">
                        <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                            <Package className="h-4 w-4 text-sidebar-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg">Admin</span>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <AdminNavLinks links={navLinks} variant="mobile" />
                    </nav>

                    <div className="mt-auto space-y-1 border-t border-sidebar-border pt-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
                        >
                            <ExternalLink className="h-5 w-5" />
                            Ver Loja
                        </Link>
                        <form action={logout}>
                            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/60 cursor-pointer hover:bg-red-500/10 hover:text-red-300 transition-all">
                                <LogOut className="h-5 w-5" />
                                Sair
                            </button>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>

            <Link href="/admin" className="flex items-center gap-2 font-bold">
                <Package className="h-5 w-5" />
                Admin
            </Link>
        </header>
    )
}
