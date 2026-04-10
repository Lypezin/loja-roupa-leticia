import Link from "next/link"
import { LogOut, Package, User } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { logoutCliente } from "./actions"

export default async function MinhaContaPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/conta/login")
    }

    const params = await searchParams
    const successMessage = params?.success
    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Cliente"

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="mx-auto max-w-4xl space-y-8">
                {successMessage && (
                    <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {successMessage}
                    </div>
                )}

                <div className="paper-panel rounded-[2rem] px-6 py-8 md:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="eyebrow">minha conta</span>
                            <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Olá, {userName}</h1>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">{user.email}</p>
                        </div>
                        <form action={logoutCliente}>
                            <Button type="submit" variant="outline" className="rounded-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair da conta
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <Link href="/conta/perfil" className="surface-card rounded-[1.8rem] p-6 transition-transform hover:-translate-y-0.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <h2 className="mt-5 text-xl font-semibold text-foreground">Meus dados</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            Nome, telefone, CPF e endereço para finalizar suas compras.
                        </p>
                    </Link>

                    <Link href="/conta/pedidos" className="surface-card rounded-[1.8rem] p-6 transition-transform hover:-translate-y-0.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Package className="h-5 w-5" />
                        </div>
                        <h2 className="mt-5 text-xl font-semibold text-foreground">Meus pedidos</h2>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            Acompanhe o histórico e o andamento de cada compra.
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
