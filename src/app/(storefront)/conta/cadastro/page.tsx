'use client'

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cadastrarCliente } from "../actions"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useState, Suspense } from "react"

function CadastroFormContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            await cadastrarCliente(formData)
        } catch {
            // redirect lança exceção — é comportamento normal do Next.js
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Criar sua conta</h1>
                    <p className="text-zinc-500 mt-2">Cadastre-se para acompanhar pedidos e salvar favoritos</p>
                </div>

                <form action={handleSubmit} className="bg-white p-8 rounded-2xl border shadow-sm space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center animate-fade-in">
                            {decodeURIComponent(error)}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Seu nome"
                            required
                            autoFocus
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                placeholder="Mínimo de 6 caracteres"
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
                                <Loader2 className="w-4 h-4 animate-spin" /> Criando conta...
                            </span>
                        ) : "Criar Conta"}
                    </Button>

                    <p className="text-sm text-center text-zinc-500">
                        Já tem conta?{" "}
                        <Link href="/conta/login" className="text-zinc-950 font-medium hover:underline">
                            Faça login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default function CadastroPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>}>
            <CadastroFormContent />
        </Suspense>
    )
}
