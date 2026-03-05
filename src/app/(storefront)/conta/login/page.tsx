'use client'

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginCliente } from "../actions"
import { Loader2, Eye, EyeOff, Mail } from "lucide-react"
import { useState, Suspense } from "react"

function LoginFormContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            await loginCliente(formData)
        } catch {
            // redirect lança exceção — é comportamento normal do Next.js
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Entrar na sua conta</h1>
                    <p className="text-zinc-500 mt-2">Acesse sua conta para acompanhar seus pedidos</p>
                </div>

                <form action={handleSubmit} className="bg-white p-8 rounded-2xl border shadow-sm space-y-5">
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 text-center animate-fade-in flex items-center gap-2 justify-center">
                            <Mail className="w-4 h-4 shrink-0" />
                            {decodeURIComponent(success)}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center animate-fade-in">
                            {decodeURIComponent(error)}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            autoFocus
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                className="h-11 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Button disabled={isLoading} type="submit" className="w-full h-11 bg-zinc-950 text-white cursor-pointer text-base">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Entrando...
                            </span>
                        ) : "Entrar"}
                    </Button>

                    <p className="text-sm text-center text-zinc-500">
                        Não tem conta?{" "}
                        <Link href="/conta/cadastro" className="text-zinc-950 font-medium hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>}>
            <LoginFormContent />
        </Suspense>
    )
}
