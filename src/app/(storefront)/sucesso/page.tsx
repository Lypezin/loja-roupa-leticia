import Link from 'next/link'
import { AlertTriangle, CheckCircle, Package, ShoppingBag, XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { ClearCartOnSuccess } from './ClearCart'
import { PaymentStatusPoll } from './PaymentStatusPoll'

type AttemptItem = {
    product_name?: string
    size?: string | null
    color?: string | null
    quantity?: number
    unit_price?: number
}

type OrderItem = {
    id: string
    quantity: number
    price: number
    products?: { name?: string | null } | null
}

type PaymentAttemptRecord = {
    external_id: string
    status: string
    total_amount: number
    receipt_url: string | null
    payment_method: string | null
    trusted_items: AttemptItem[] | null
}

type OrderRecord = {
    id: string
    status: string
    total_amount: number
    payment_method: string | null
    payment_receipt_url: string | null
    order_items: OrderItem[] | null
}

export default async function SucessoPage({
    searchParams,
}: {
    searchParams: Promise<{ checkout_ref?: string }>
}) {
    const params = await searchParams
    const checkoutRef = params?.checkout_ref

    if (!checkoutRef) {
        redirect('/')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/conta/login?reason=checkout_login_required&next=${encodeURIComponent(`/sucesso?checkout_ref=${checkoutRef}`)}`)
    }

    const { data: paymentAttempt } = await supabase
        .from('payment_attempts')
        .select('external_id, status, total_amount, receipt_url, payment_method, trusted_items')
        .eq('external_id', checkoutRef)
        .eq('user_id', user.id)
        .maybeSingle()

    const { data: order } = await supabase
        .from('orders')
        .select(`
            id,
            status,
            total_amount,
            payment_method,
            payment_receipt_url,
            order_items (
                id,
                quantity,
                price,
                products ( name )
            )
        `)
        .eq('payment_external_id', checkoutRef)
        .eq('user_id', user.id)
        .maybeSingle()

    const typedAttempt = paymentAttempt as PaymentAttemptRecord | null
    const typedOrder = order as OrderRecord | null

    if (!typedAttempt && !typedOrder) {
        return (
            <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border text-center space-y-6 shadow-sm">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Checkout invalido</h1>
                    <p className="text-muted-foreground">Nao foi possivel localizar esta tentativa de pagamento.</p>
                    <Link href="/">
                        <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-medium gap-2">
                            Voltar para a loja
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const attemptItems = typedAttempt?.trusted_items || []
    const currentStatus = typedOrder?.status || typedAttempt?.status || 'pending'
    const isFailureState = currentStatus === 'failed' || currentStatus === 'cancelled'
    const isWarningState = currentStatus === 'refunded' || currentStatus === 'disputed'
    const shouldPoll = Boolean(
        typedAttempt
        && !typedOrder
        && currentStatus !== 'failed'
        && currentStatus !== 'refunded'
        && currentStatus !== 'disputed'
        && currentStatus !== 'cancelled'
    )
    const receiptUrl = typedOrder?.payment_receipt_url || typedAttempt?.receipt_url || null
    const paymentMethod = typedOrder?.payment_method || typedAttempt?.payment_method
    const orderItems = typedOrder?.order_items || []
    const canClearCart = Boolean(typedOrder)
    const title = typedOrder
        ? 'Pedido confirmado!'
        : isFailureState
            ? 'Pagamento nao concluido'
            : currentStatus === 'refunded'
                ? 'Pagamento reembolsado'
                : currentStatus === 'disputed'
                    ? 'Pagamento em analise'
                    : 'Pagamento recebido'
    const description = typedOrder
        ? 'Seu pagamento foi confirmado e o pedido ja esta salvo na sua conta.'
        : isFailureState
            ? 'Nao conseguimos confirmar este pagamento. Voce pode voltar ao carrinho e tentar novamente.'
            : currentStatus === 'refunded'
                ? 'O pagamento foi reembolsado e nao gerou um pedido ativo.'
                : currentStatus === 'disputed'
                    ? 'Recebemos uma sinalizacao sobre este pagamento e o pedido foi pausado para analise.'
                    : 'Aguardando a confirmacao final do webhook da AbacatePay. Esta pagina atualiza sozinha em alguns segundos.'
    const Icon = typedOrder ? CheckCircle : isFailureState ? XCircle : isWarningState ? AlertTriangle : CheckCircle
    const iconWrapperClassName = typedOrder
        ? 'bg-emerald-100'
        : isFailureState
            ? 'bg-red-100'
            : isWarningState
                ? 'bg-amber-100'
                : 'bg-emerald-100'
    const iconClassName = typedOrder
        ? 'text-emerald-600'
        : isFailureState
            ? 'text-red-600'
            : isWarningState
                ? 'text-amber-600'
                : 'text-emerald-600'

    return (
        <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center">
            <div className="max-w-lg w-full bg-card p-8 rounded-3xl border border-border text-center space-y-6 shadow-sm">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${iconWrapperClassName}`}>
                    <Icon className={`w-10 h-10 ${iconClassName}`} />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>

                <p className="text-muted-foreground">{description}</p>

                <div className="bg-muted/40 rounded-xl p-4 text-left space-y-3 border">
                    <h3 className="font-semibold text-sm text-foreground">Resumo da compra</h3>
                    <div className="space-y-2">
                        {typedOrder ? orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {item.quantity}x {item.products?.name || 'Produto'}
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </div>
                        )) : attemptItems.map((item, index) => (
                            <div key={`${checkoutRef}-${index}`} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {item.quantity || 0}x {item.product_name || 'Produto'}
                                </span>
                                <span className="font-medium">
                                    {formatCurrency((item.unit_price || 0) * (item.quantity || 0))}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>{formatCurrency(typedOrder?.total_amount || typedAttempt?.total_amount || 0)}</span>
                    </div>
                    {paymentMethod && (
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
                            Metodo: {paymentMethod}
                        </p>
                    )}
                </div>

                <div className="pt-4 space-y-3">
                    {typedOrder ? (
                        <Link href="/conta/pedidos">
                            <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-medium gap-2">
                                <Package className="w-5 h-5" /> Ver meus pedidos
                            </Button>
                        </Link>
                    ) : isFailureState ? (
                        <Link href="/carrinho">
                            <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-medium gap-2">
                                <ShoppingBag className="w-5 h-5" /> Voltar ao carrinho
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled className="w-full h-12 rounded-xl font-medium gap-2">
                            <Package className="w-5 h-5" /> Aguardando confirmacao
                        </Button>
                    )}

                    {receiptUrl && (
                        <a href={receiptUrl} target="_blank" rel="noreferrer" className="block">
                            <Button variant="outline" className="w-full h-12 rounded-xl font-medium">
                                Ver recibo
                            </Button>
                        </a>
                    )}

                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full h-12 rounded-xl font-medium gap-2">
                            <ShoppingBag className="w-5 h-5" /> Continuar comprando
                        </Button>
                    </Link>
                </div>
            </div>

            <PaymentStatusPoll enabled={shouldPoll} />
            <ClearCartOnSuccess enabled={canClearCart} />
        </div>
    )
}
