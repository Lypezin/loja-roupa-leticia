'use client'

import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CartEmptyState() {
    return (
        <div className="page-shell py-20">
            <div className="paper-panel mx-auto max-w-xl rounded-[2rem] px-6 py-10 text-center md:px-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                    <ShoppingBag className="h-7 w-7" />
                </div>
                <h1 className="mt-6 font-display text-4xl text-foreground">Sua sacola está vazia</h1>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                    Volte para a loja e escolha os itens que deseja adicionar.
                </p>
                <Link href="/" className="mt-7 inline-flex">
                    <Button className="gap-2 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para a loja
                    </Button>
                </Link>
            </div>
        </div>
    )
}
