'use client'

import Link from "next/link"
import { User, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "./ThemeToggle"

interface UserActionsProps {
    mounted: boolean;
    isLoggedIn: boolean;
    totalItems: number;
}

export function UserActions({ mounted, isLoggedIn, totalItems }: UserActionsProps) {
    return (
        <div className="flex items-center gap-1">
            {mounted && (
                <Link href={isLoggedIn ? "/conta" : "/conta/login"}>
                    <button className="relative p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <User className="w-5 h-5" />
                        {isLoggedIn && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"
                            />
                        )}
                    </button>
                </Link>
            )}

            <Link href="/carrinho">
                <button className="relative p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                    <ShoppingBag className="w-5 h-5" />
                    {mounted && totalItems > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg"
                        >
                            {totalItems}
                        </motion.span>
                    )}
                </button>
            </Link>

            <div className="w-px h-4 bg-border mx-1" />
            <ThemeToggle />
        </div>
    )
}
