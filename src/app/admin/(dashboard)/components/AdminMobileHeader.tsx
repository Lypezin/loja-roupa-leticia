'use client'

import Link from "next/link"
import { ExternalLink, LogOut, Menu, Package } from "lucide-react"
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
        <header className="flex h-16 items-center gap-4 border-b border-border bg-background/88 px-4 backdrop-blur-xl lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu de navegacao</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex w-72 flex-col border-sidebar-border bg-sidebar text-sidebar-foreground">
                    <SheetTitle className="sr-only">Menu lateral</SheetTitle>
                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                            <Package className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="font-display text-3xl leading-none">Admin</p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/45">operacao</p>
                        </div>
                    </div>

                    <nav className="mt-8 flex flex-col gap-1">
                        <AdminNavLinks links={navLinks} variant="mobile" />
                    </nav>

                    <div className="mt-auto space-y-1 border-t border-sidebar-border pt-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm text-sidebar-foreground/72 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        >
                            <ExternalLink className="h-5 w-5" />
                            Ver loja
                        </Link>
                        <form action={logout}>
                            <button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-[1rem] px-3 py-3 text-sm text-sidebar-foreground/65 transition-colors hover:bg-red-50 hover:text-red-600">
                                <LogOut className="h-5 w-5" />
                                Sair
                            </button>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>

            <Link href="/admin" className="flex items-center gap-2">
                <span className="eyebrow hidden sm:inline-flex">operacao</span>
                <span className="font-display text-3xl leading-none text-foreground">Admin</span>
            </Link>
        </header>
    )
}
