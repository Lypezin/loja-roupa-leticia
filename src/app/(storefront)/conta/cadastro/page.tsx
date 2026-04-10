'use client'

import Link from "next/link"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react"
import { cadastrarCliente } from "../actions"

function CadastroForm() {
    const searchParams = useSearchParams()
    const errorMsg = searchParams.get("error")
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="page-shell flex min-h-[80vh] items-center justify-center py-12">
            <div className="w-full max-w-md paper-panel rounded-[2rem] px-6 py-8 md:px-8">
                <div className="text-center">
                    <span className="eyebrow justify-center">cadastro</span>
                    <Link href="/" className="mt-5 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Voltar para a loja
                    </Link>
                    <h1 className="mt-6 font-display text-4xl text-foreground">Criar conta</h1>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Guarde seus pedidos, acompanhe o status e compre com mais fluidez.
                    </p>
                </div>

                {errorMsg && (
                    <div className="mt-6 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {decodeURIComponent(errorMsg)}
                    </div>
                )}

                <form
                    action={async (formData) => {
                        setIsLoading(true)
                        try {
                            await cadastrarCliente(formData)
                        } catch {
                            setIsLoading(false)
                        }
                    }}
                    className="mt-6 space-y-4"
                >
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Nome completo"
                            required
                            className="h-12 w-full rounded-[1rem] border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            required
                            className="h-12 w-full rounded-[1rem] border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Senha (mínimo de 6 caracteres)"
                            required
                            minLength={6}
                            className="h-12 w-full rounded-[1rem] border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>Criar conta <ArrowRight className="h-4 w-4" /></>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link href="/conta/login" className="font-semibold text-foreground hover:underline">
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default function CadastroPage() {
    return (
        <Suspense fallback={
            <div className="page-shell flex min-h-[80vh] items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-muted border-t-foreground animate-spin" />
            </div>
        }>
            <CadastroForm />
        </Suspense>
    )
}
