import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, User, LogOut } from "lucide-react"
import { logoutCliente } from "./actions"

export default async function MinhaContaPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/conta/login')
    }

    const params = await searchParams
    const successMessage = params?.success

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Cliente'

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <div className="space-y-8">
                {successMessage && (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg p-3 text-center animate-fade-in">
                        {successMessage}
                    </div>
                )}

                <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Olá, {userName}!</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>

                <div className="grid gap-4">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                                <Package className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground">Meus Pedidos</h3>
                                <p className="text-sm text-muted-foreground">Acompanhe seus pedidos e entregas</p>
                            </div>
                            <Link href="/conta/pedidos">
                                <Button variant="outline" className="cursor-pointer">Ver Pedidos</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <form action={logoutCliente}>
                        <Button type="submit" variant="outline" className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair da Conta
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
