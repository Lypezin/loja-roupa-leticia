'use client'

import Link from "next/link"
import { User, ShoppingBag } from "lucide-react"
import { useEffect, useState, useSyncExternalStore } from "react"
import { createClient } from "@/lib/supabase/client"
import { useCartStore } from "@/store/useCartStore"

interface UserActionsProps {
    isLoggedIn: boolean
}

export function UserActions({ isLoggedIn }: UserActionsProps) {
    const totalItems = useCartStore((state) => state.totalItems())
    const [hasSession, setHasSession] = useState(isLoggedIn)
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    )

    useEffect(() => {
        const supabase = createClient()

        void supabase.auth.getSession().then(({ data }) => {
            setHasSession(Boolean(data.session))
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setHasSession(Boolean(session))
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <div className="flex items-center gap-2">
            <Link href={hasSession ? "/conta" : "/conta/login"} aria-label={hasSession ? "Abrir minha conta" : "Entrar na conta"}>
                <span className="interactive-icon interactive-press relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground">
                    <User className="h-4.5 w-4.5" />
                    {hasSession && (
                        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background transition-transform duration-300" />
                    )}
                </span>
            </Link>

            <Link href="/carrinho" aria-label="Abrir carrinho">
                <span className="interactive-icon interactive-press relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground">
                    <ShoppingBag className="h-4.5 w-4.5" />
                    {mounted && totalItems > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm transition-transform duration-300">
                            {totalItems}
                        </span>
                    )}
                </span>
            </Link>
        </div>
    )
}
