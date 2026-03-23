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

                <div className="grid sm:grid-cols-2 gap-4">
                    {/* Card Meus Dados */}
                    <Link href="/conta/perfil" className="group block">
                        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all group-hover:border-primary/50 h-full flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground text-lg">Meus Dados</h3>
                            </div>
                            <p className="text-sm text-muted-foreground flex-1">
                                Gerencie suas informações pessoais, como nome, telefone e CPF.
                            </p>
                            <div className="mt-4 pt-4 border-t border-border flex items-center text-sm font-medium text-primary">
                                Editar Perfil <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Card Meus Pedidos */}
                    <Link href="/conta/pedidos" className="group block">
                        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all group-hover:border-primary/50 h-full flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground text-lg">Meus Pedidos</h3>
                            </div>
                            <p className="text-sm text-muted-foreground flex-1">
                                Acompanhe o status e histórico de todas as suas compras.
                            </p>
                            <div className="mt-4 pt-4 border-t border-border flex items-center text-sm font-medium text-primary">
                                Ver Pedidos <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex flex-col items-center gap-4 pt-8">
                    <form action={logoutCliente}>
                        <Button type="submit" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair da Conta
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
