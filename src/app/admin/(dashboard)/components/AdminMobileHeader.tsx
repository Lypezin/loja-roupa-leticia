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
        <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
                        <Menu className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex w-72 flex-col border-sidebar-border bg-sidebar text-sidebar-foreground">
                    <SheetTitle className="sr-only">Menu lateral</SheetTitle>
                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <Store className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Painel Admin</p>
                            <p className="text-[11px] text-sidebar-foreground/50">Gerenciamento da loja</p>
                        </div>
                    </div>

                    <nav className="mt-6 flex flex-col gap-1">
                        <AdminNavLinks links={navLinks} variant="mobile" />
                    </nav>

                    <div className="mt-auto space-y-0.5 border-t border-sidebar-border pt-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Ver loja
                        </Link>
                        <form action={logout}>
                            <button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600">
                                <LogOut className="h-4 w-4" />
                                Sair
                            </button>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>

            <Link href="/admin" className="flex items-center gap-2">
                <Store className="h-4 w-4 text-foreground/70" />
                <span className="text-sm font-semibold text-foreground">Painel Admin</span>
            </Link>
        </header>
    )
}
