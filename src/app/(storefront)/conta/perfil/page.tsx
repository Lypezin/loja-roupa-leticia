import Link from "next/link"
import { ArrowLeft, FileText, Mail, Phone, User } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { atualizarPerfil } from "./actions"

export default async function PerfilPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; error?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/conta/login')
    }

    const params = await searchParams
    const successMessage = params?.success
    const errorMessage = params?.error

    const fullName = user.user_metadata?.full_name || ''
    const phone = user.user_metadata?.phone || ''
    const cpf = user.user_metadata?.cpf || ''
    const email = user.email || ''

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="mx-auto max-w-3xl space-y-6">
                <Link href="/conta" className="ink-link">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para minha conta
                </Link>

                <div className="paper-panel rounded-[2rem] px-6 py-8 md:px-8">
                    <span className="eyebrow">dados pessoais</span>
                    <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Editar perfil</h1>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">Atualize os dados basicos da sua conta com seguranca.</p>
                </div>

                {successMessage && (
                    <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="surface-card rounded-[1.8rem] p-6 md:p-8">
                    <form action={atualizarPerfil} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    defaultValue={fullName}
                                    placeholder="Seu nome completo"
                                    required
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    defaultValue={phone}
                                    placeholder="(11) 90000-0000"
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="cpf" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    defaultValue={cpf}
                                    placeholder="000.000.000-00"
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    disabled
                                    className="h-12 w-full rounded-[1rem] border border-border bg-muted px-4 text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="rounded-full">
                                Salvar alteracoes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
