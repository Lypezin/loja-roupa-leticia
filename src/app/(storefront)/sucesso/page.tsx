import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, Package, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ClearCartOnSuccess } from './ClearCart'

export default async function SucessoPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    const params = await searchParams
    const sessionId = params?.session_id
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!sessionId) {
        redirect('/')
    }

    let session: Stripe.Checkout.Session | null = null
    let lineItems: Stripe.LineItem[] = []

    try {
        session = await stripe.checkout.sessions.retrieve(sessionId)
        const items = await stripe.checkout.sessions.listLineItems(sessionId)
        lineItems = items.data || []
    } catch {
        return (
            <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border text-center space-y-6 shadow-sm">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Sessao invalida</h1>
                    <p className="text-muted-foreground">Nao foi possivel verificar este pagamento. Verifique seus pedidos na sua conta.</p>
                    <Link href="/">
                        <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-medium gap-2">
                            Voltar para a Loja
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const customerEmail = typeof session.customer_details?.email === 'string'
        ? session.customer_details.email
        : session.customer_email

    const canViewOrderDetails = Boolean(
        user && (
            session.client_reference_id === user.id
            || (
                typeof customerEmail === 'string'
                && typeof user.email === 'string'
                && customerEmail.toLowerCase() === user.email.toLowerCase()
            )
        )
    )

    const isPaid = session.payment_status === 'paid'

    return (
        <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
            <div className="max-w-lg w-full bg-card p-8 rounded-3xl border border-border text-center space-y-6 shadow-sm">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {canViewOrderDetails ? (isPaid ? 'Pedido Confirmado!' : 'Pagamento Pendente') : 'Compra Recebida'}
                </h1>

                <p className="text-muted-foreground">
                    {canViewOrderDetails
                        ? (
                            isPaid
                                ? 'Seu pagamento foi processado com sucesso. Voce pode acompanhar o status do seu pedido na sua conta.'
                                : 'Seu pagamento esta sendo processado. Assim que for confirmado, voce recebera uma notificacao.'
                        )
                        : 'Para proteger os dados do pedido, o resumo detalhado so e exibido para a conta usada na compra.'}
                </p>

                {canViewOrderDetails && lineItems.length > 0 && (
                    <div className="bg-muted/40 rounded-xl p-4 text-left space-y-3 border">
                        <h3 className="font-semibold text-sm text-foreground">Resumo da Compra</h3>
                        <div className="space-y-2">
                            {lineItems.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {item.quantity}x {item.description}
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(item.amount_total / 100)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>{formatCurrency((session.amount_total || 0) / 100)}</span>
                        </div>
                    </div>
                )}

                <div className="pt-4 space-y-3">
                    {canViewOrderDetails ? (
                        <Link href="/conta/pedidos">
                            <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-medium gap-2">
                                <Package className="w-5 h-5" /> Ver Meus Pedidos
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/conta/login">
                            <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-medium gap-2">
                                <Package className="w-5 h-5" /> Entrar na Conta
                            </Button>
                        </Link>
                    )}
                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full h-12 rounded-xl font-medium gap-2">
                            <ShoppingBag className="w-5 h-5" /> Continuar Comprando
                        </Button>
                    </Link>
                </div>
            </div>
            <ClearCartOnSuccess />
        </div>
    )
}
