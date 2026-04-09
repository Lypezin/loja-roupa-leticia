'use client'

import Link from "next/link"
import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { loginCliente } from "../actions"

function LoginForm() {
    const searchParams = useSearchParams()
    const errorMsg = searchParams.get("error")
    const successMsg = searchParams.get("success")
    const nextPath = searchParams.get("next") || "/conta"
    const reason = searchParams.get("reason")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const reasonMessage = reason === 'checkout_login_required'
        ? 'Entre na sua conta para continuar com o pagamento.'
        : null

    return (
        <div className="page-shell flex min-h-[80vh] items-center justify-center py-12">
            <div className="paper-panel w-full max-w-md rounded-[2rem] px-6 py-8 md:px-8">
                <div className="text-center">
                    <span className="eyebrow justify-center">acesso</span>
                    <Link href="/" className="mt-5 block font-display text-4xl text-foreground">
                        FASHION STORE
                    </Link>
                    <h1 className="mt-6 font-display text-4xl text-foreground">Entrar</h1>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Acompanhe seus pedidos e suas informacoes de conta.
                    </p>
                </div>

                {reasonMessage && (
                    <div className="mt-6 rounded-[1.2rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {reasonMessage}
                    </div>
                )}

                {errorMsg && (
                    <div className="mt-6 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {decodeURIComponent(errorMsg)}
                    </div>
                )}

                {successMsg && (
                    <div className="mt-6 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {decodeURIComponent(successMsg)}
                    </div>
                )}

                <form action={async (formData) => {
                    setIsLoading(true)
                    try { await loginCliente(formData) } catch { } finally { setIsLoading(false) }
                }} className="mt-6 space-y-4">
                    <input type="hidden" name="next" value={nextPath} />
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            required
                            className="h-12 w-full rounded-[1rem] border border-border bg-background pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>Entrar <ArrowRight className="h-4 w-4" /></>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Nao tem uma conta?{" "}
                    <Link href="/conta/cadastro" className="font-semibold text-foreground hover:underline">
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="page-shell flex min-h-[80vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
