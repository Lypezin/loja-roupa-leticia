import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "./actions"

export default async function AdminLogin({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    const { error } = searchParams

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Painel Administrativo</CardTitle>
                    <CardDescription>
                        Entre com suas credenciais para gerenciar a loja
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={login} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nome@exemplo.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        {error && <p className="text-sm font-medium text-red-500 text-center">{error}</p>}
                        <Button type="submit" className="w-full cursor-pointer">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
