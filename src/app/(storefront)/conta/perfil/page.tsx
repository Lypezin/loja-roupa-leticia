import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Phone, FileText, Mail } from "lucide-react"
import { atualizarPerfil } from "./actions"

export default async function PerfilPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string, error?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/conta/login')
    }

    const params = await searchParams
    const successMessage = params?.success
    const errorMessage = params?.error

    // Extrair dados atuais do user_metadata
    const fullName = user.user_metadata?.full_name || ''
    const phone = user.user_metadata?.phone || ''
    const cpf = user.user_metadata?.cpf || ''
    const email = user.email || ''

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
            <Link href="/conta" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Minha Conta
            </Link>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Meus Dados</h1>
                    <p className="text-muted-foreground mt-2">Atualize suas informações pessoais abaixo.</p>
                </div>

                {successMessage && (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg p-4 animate-fade-in">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm rounded-lg p-4 animate-fade-in">
                        {errorMessage}
                    </div>
                )}

                <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                    <form action={atualizarPerfil} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Nome Completo */}
                            <div className="space-y-2 sm:col-span-2">
                                <label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    defaultValue={fullName}
                                    placeholder="Seu nome completo"
                                    required
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                />
                            </div>

                            {/* Telefone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    defaultValue={phone}
                                    placeholder="(11) 90000-0000"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                />
                            </div>

                            {/* CPF */}
                            <div className="space-y-2">
                                <label htmlFor="cpf" className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    defaultValue={cpf}
                                    placeholder="000.000.000-00"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
                                />
                            </div>

                            {/* E-mail (Somente leitura para simplificar) */}
                            <div className="space-y-2 sm:col-span-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    E-mail <span className="text-xs text-muted-foreground font-normal">(não editável)</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed opacity-70"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end">
                            <Button type="submit" className="w-full sm:w-auto cursor-pointer">
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
