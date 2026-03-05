'use client'

import { useSearchParams } from "next/navigation"
import { cadastrarCliente } from "../actions"
import Link from "next/link"
import { useState, Suspense } from "react"
import { Loader2, User, Mail, Lock, ArrowRight } from "lucide-react"

function CadastroForm() {
    const searchParams = useSearchParams()
    const errorMsg = searchParams.get("error")
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block font-bold text-2xl tracking-[-0.05em] text-zinc-900 mb-6">
                        FASHION STORE
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Crie sua conta</h1>
                    <p className="text-zinc-500 text-sm mt-2">
                        Cadastre-se e tenha acesso a ofertas exclusivas.
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 border border-red-100">
                        {decodeURIComponent(errorMsg)}
                    </div>
                )}

                <form action={async (formData) => {
                    setIsLoading(true)
                    try { await cadastrarCliente(formData) } catch { } finally { setIsLoading(false) }
                }} className="space-y-4">

                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Nome completo"
                            required
                            className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            required
                            className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Senha (mínimo 6 caracteres)"
                            required
                            minLength={6}
                            className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-zinc-950 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>Criar Conta <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-500 mt-8">
                    Já tem uma conta?{" "}
                    <Link href="/conta/login" className="text-zinc-900 font-semibold hover:underline">
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
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        }>
            <CadastroForm />
        </Suspense>
    )
}
