import Link from "next/link"
import { ArrowLeft, FileText, Mail, Phone, User } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { readCustomerProfile } from "@/lib/customer-profile"
import { createClient } from "@/lib/supabase/server"
import { atualizarPerfil } from "./actions"

export default async function PerfilPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; error?: string; reason?: string; next?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/conta/login')
    }

    const params = await searchParams
    const successMessage = params?.success
    const errorMessage = params?.error
    const nextPath = params?.next || ''
    const reason = params?.reason
    const profile = readCustomerProfile(user)
    const metadata = user.user_metadata && typeof user.user_metadata === 'object'
        ? user.user_metadata as Record<string, string | undefined>
        : {}
    const warningMessage = reason === 'checkout_profile_required'
        ? 'Preencha seus dados para continuar com o pagamento na AbacatePay.'
        : null
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

                {warningMessage && (
                    <div className="rounded-[1.2rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {warningMessage}
                    </div>
                )}

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
                        <input type="hidden" name="next" value={nextPath} />

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
                                    defaultValue={profile?.fullName || ''}
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
                                    defaultValue={profile?.phone || ''}
                                    placeholder="+55 11 90000-0000"
                                    required
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
                                    defaultValue={profile?.cpf || ''}
                                    placeholder="000.000.000-00"
                                    required
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

                            <div className="space-y-2 sm:col-span-2">
                                <label htmlFor="addressLine1" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Endereco
                                </label>
                                <input
                                    type="text"
                                    id="addressLine1"
                                    name="addressLine1"
                                    defaultValue={profile?.shippingAddress?.line1 || metadata.address_line1 || ''}
                                    placeholder="Rua, numero e complemento principal"
                                    required
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <label htmlFor="addressLine2" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Complemento
                                </label>
                                <input
                                    type="text"
                                    id="addressLine2"
                                    name="addressLine2"
                                    defaultValue={profile?.shippingAddress?.line2 || metadata.address_line2 || ''}
                                    placeholder="Apartamento, bloco, referencia"
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Cidade
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    defaultValue={profile?.shippingAddress?.city || metadata.city || ''}
                                    placeholder="Cidade"
                                    required
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="state" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    defaultValue={profile?.shippingAddress?.state || metadata.state || ''}
                                    placeholder="UF"
                                    required
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="postalCode" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    CEP
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    defaultValue={profile?.shippingAddress?.postal_code || metadata.postal_code || ''}
                                    placeholder="00000-000"
                                    required
                                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
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
