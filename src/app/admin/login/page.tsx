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
            <Card className="w-full max-w-sm border shadow-sm">
                <CardContent className="px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-foreground">Painel Admin</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Entre com suas credenciais para acessar o painel.
                        </p>
                    </div>

                    <form action={login} className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nome@exemplo.com"
                                required
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-10"
                            />
                        </div>

                        {error && (
                            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-center text-red-700">
                                {error}
                            </p>
                        )}

                        <Button type="submit" className="h-10 w-full cursor-pointer">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
