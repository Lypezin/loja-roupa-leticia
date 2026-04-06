'use client'

import Link from "next/link"
import { User, ShoppingBag } from "lucide-react"
import { useSyncExternalStore } from "react"
import { useCartStore } from "@/store/useCartStore"

interface UserActionsProps {
    isLoggedIn: boolean
}

export function UserActions({ isLoggedIn }: UserActionsProps) {
    const totalItems = useCartStore((state) => state.totalItems())
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    )

    return (
        <div className="flex items-center gap-2">
            <Link href={isLoggedIn ? "/conta" : "/conta/login"}>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <User className="h-4.5 w-4.5" />
                    {isLoggedIn && (
                        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                    )}
                </span>
            </Link>

            <Link href="/carrinho">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <ShoppingBag className="h-4.5 w-4.5" />
                    {mounted && totalItems > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                            {totalItems}
                        </span>
                    )}
                </span>
            </Link>
        </div>
    )
}
