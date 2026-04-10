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
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <Card className="paper-panel w-full max-w-md border-none shadow-[0_24px_60px_rgba(68,48,31,0.12)]">
                <CardContent className="px-6 py-8 md:px-8">
                    <div className="text-center">
                        <span className="eyebrow justify-center">admin</span>
                        <h1 className="mt-5 font-display text-4xl text-foreground">Painel da loja</h1>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            {"Entre com suas credenciais para gerenciar cat\u00e1logo, pedidos e conte\u00fado."}
                        </p>
                    </div>

                    <form action={login} className="mt-8 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nome@exemplo.com"
                                required
                                className="h-12 rounded-[1rem] bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-12 rounded-[1rem] bg-background"
                            />
                        </div>

                        {error && (
                            <p className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-center text-red-700">
                                {error}
                            </p>
                        )}

                        <Button type="submit" className="h-12 w-full rounded-full cursor-pointer">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
