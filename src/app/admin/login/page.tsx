import { ShieldCheck, Store } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "./actions"

export default async function AdminLogin({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    return (
        <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,rgba(251,249,246,0.96),rgba(245,240,233,0.98))] px-4 py-12">
            <Card className="w-full max-w-md rounded-[2rem] border-zinc-200/80 bg-white/90 shadow-[0_24px_80px_rgba(79,55,39,0.08)]">
                <CardContent className="px-6 py-8 md:px-8">
                    <div className="space-y-4 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                            <Store className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Acesso administrativo
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-zinc-950">
                                Entrar no painel
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-zinc-600">
                                Use suas credenciais para administrar catálogo, pedidos, conteúdo e logística.
                            </p>
                        </div>
                    </div>

                    <form action={login} className="mt-8 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nome@exemplo.com"
                                required
                                className="h-11 rounded-2xl border-zinc-200 bg-zinc-50/60"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-11 rounded-2xl border-zinc-200 bg-zinc-50/60"
                            />
                        </div>

                        {error && (
                            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-center text-red-700">
                                {error}
                            </p>
                        )}

                        <Button type="submit" className="h-11 w-full cursor-pointer rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                            Entrar
                        </Button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Área restrita para administração da loja
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
