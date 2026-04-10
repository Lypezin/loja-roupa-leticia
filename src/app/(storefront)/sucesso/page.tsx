import Link from "next/link"
import { AlertTriangle, CheckCircle, Package, ShoppingBag, XCircle } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { ClearCartOnSuccess } from "./ClearCart"
import { PaymentStatusPoll } from "./PaymentStatusPoll"

const PENDING_TIMEOUT_MINUTES = 10

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
    created_at: string
}

type OrderRecord = {
    id: string
    status: string
    total_amount: number
    payment_method: string | null
    payment_receipt_url: string | null
    order_items: OrderItem[] | null
}

function isExpiredPendingAttempt(attempt: PaymentAttemptRecord | null) {
    if (!attempt || attempt.status !== "pending") {
        return false
    }

    const createdAt = new Date(attempt.created_at).getTime()
    const timeoutInMs = PENDING_TIMEOUT_MINUTES * 60 * 1000

    return Number.isFinite(createdAt) && Date.now() - createdAt > timeoutInMs
}

export default async function SucessoPage({
    searchParams,
}: {
    searchParams: Promise<{ checkout_ref?: string }>
}) {
    const params = await searchParams
    const checkoutRef = params?.checkout_ref

    if (!checkoutRef) {
        redirect("/")
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/conta/login?reason=checkout_login_required&next=${encodeURIComponent(`/sucesso?checkout_ref=${checkoutRef}`)}`)
    }

    const { data: paymentAttempt } = await supabase
        .from("payment_attempts")
        .select("external_id, status, total_amount, receipt_url, payment_method, trusted_items, created_at")
        .eq("external_id", checkoutRef)
        .eq("user_id", user.id)
        .maybeSingle()

    const { data: order } = await supabase
        .from("orders")
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
        .eq("payment_external_id", checkoutRef)
        .eq("user_id", user.id)
        .maybeSingle()

    const typedAttempt = paymentAttempt as PaymentAttemptRecord | null
    const typedOrder = order as OrderRecord | null

    if (!typedAttempt && !typedOrder) {
        return (
            <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20">
                <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Checkout inválido</h1>
                    <p className="mt-3 text-muted-foreground">Não foi possível localizar esta tentativa de pagamento.</p>
                    <Link href="/" className="mt-6 block">
                        <Button className="h-12 w-full rounded-xl bg-foreground font-medium text-background hover:bg-foreground/90">
                            Voltar para a loja
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const attemptItems = typedAttempt?.trusted_items || []
    const currentStatus = typedOrder?.status || typedAttempt?.status || "pending"
    const isFailureState = currentStatus === "failed" || currentStatus === "cancelled"
    const isWarningState = currentStatus === "refunded" || currentStatus === "disputed"
    const isExpiredPending = isExpiredPendingAttempt(typedAttempt)
    const shouldPoll = Boolean(
        typedAttempt &&
        !typedOrder &&
        !isFailureState &&
        !isWarningState &&
        !isExpiredPending
    )
    const receiptUrl = typedOrder?.payment_receipt_url || typedAttempt?.receipt_url || null
    const paymentMethod = typedOrder?.payment_method || typedAttempt?.payment_method
    const orderItems = typedOrder?.order_items || []
    const hasConfirmedOrder = Boolean(typedOrder) && !isFailureState && !isWarningState
    const canClearCart = Boolean(typedOrder)
    const waitingWebhook = !typedOrder && !isFailureState && !isWarningState && !isExpiredPending
    const title = hasConfirmedOrder
        ? "Pedido confirmado!"
        : isFailureState
            ? "Pagamento não concluído"
            : currentStatus === "refunded"
                ? "Pagamento reembolsado"
                : currentStatus === "disputed"
                    ? "Pagamento em análise"
                    : isExpiredPending
                        ? "Pagamento em verificação"
                        : "Pagamento recebido"
    const description = hasConfirmedOrder
        ? "Seu pagamento foi confirmado e o pedido já está salvo na sua conta."
        : isFailureState
            ? "Não conseguimos confirmar este pagamento. Você pode voltar ao carrinho e tentar novamente."
            : currentStatus === "refunded"
                ? "O pagamento foi reembolsado e não gerou um pedido ativo."
                : currentStatus === "disputed"
                    ? "Recebemos uma sinalização sobre este pagamento e o pedido foi pausado para análise."
                    : isExpiredPending
                        ? "O pagamento foi recebido, mas a confirmação automática demorou mais do que o esperado. Se o valor já saiu da sua conta, fale com a loja e informe o código do checkout."
                        : "Aguardando a confirmação final do webhook da AbacatePay. Esta página atualiza sozinha em alguns segundos."
    const methodLabel = paymentMethod?.includes(",") ? "Métodos aceitos" : "Método"
    const Icon = hasConfirmedOrder ? CheckCircle : isFailureState ? XCircle : isWarningState || isExpiredPending ? AlertTriangle : CheckCircle
    const iconWrapperClassName = hasConfirmedOrder
        ? "bg-emerald-100"
        : isFailureState
            ? "bg-red-100"
            : isWarningState || isExpiredPending
                ? "bg-amber-100"
                : "bg-emerald-100"
    const iconClassName = hasConfirmedOrder
        ? "text-emerald-600"
        : isFailureState
            ? "text-red-600"
            : isWarningState || isExpiredPending
                ? "text-amber-600"
                : "text-emerald-600"

    return (
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20">
            <div className="max-w-lg w-full rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
                <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${iconWrapperClassName}`}>
                    <Icon className={`h-10 w-10 ${iconClassName}`} />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="mt-3 text-muted-foreground">{description}</p>

                <div className="mt-6 space-y-3 rounded-xl border bg-muted/40 p-4 text-left">
                    <h3 className="text-sm font-semibold text-foreground">Resumo da compra</h3>

                    <div className="space-y-2">
                        {typedOrder ? orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {item.quantity}x {item.products?.name || "Produto"}
                                </span>
                                <span className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </div>
                        )) : attemptItems.map((item, index) => (
                            <div key={`${checkoutRef}-${index}`} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {item.quantity || 0}x {item.product_name || "Produto"}
                                </span>
                                <span className="font-medium">
                                    {formatCurrency((item.unit_price || 0) * (item.quantity || 0))}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(typedOrder?.total_amount || typedAttempt?.total_amount || 0)}</span>
                    </div>

                    {paymentMethod && (
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {methodLabel}: {paymentMethod}
                        </p>
                    )}

                    {!typedOrder && (
                        <p className="text-xs text-muted-foreground">
                            Código do checkout: <span className="font-medium text-foreground">{checkoutRef}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-3 pt-4">
                    {typedOrder ? (
                        <Link href="/conta/pedidos">
                            <Button className="h-12 w-full rounded-xl bg-foreground font-medium text-background hover:bg-foreground/90">
                                <Package className="h-5 w-5" /> Ver meus pedidos
                            </Button>
                        </Link>
                    ) : isFailureState ? (
                        <Link href="/carrinho">
                            <Button className="h-12 w-full rounded-xl bg-foreground font-medium text-background hover:bg-foreground/90">
                                <ShoppingBag className="h-5 w-5" /> Voltar ao carrinho
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled className="h-12 w-full rounded-xl font-medium">
                            <Package className="h-5 w-5" /> {waitingWebhook ? "Aguardando confirmação" : "Em verificação"}
                        </Button>
                    )}

                    {receiptUrl && (
                        <a href={receiptUrl} target="_blank" rel="noreferrer" className="block">
                            <Button variant="outline" className="h-12 w-full rounded-xl font-medium">
                                Ver recibo
                            </Button>
                        </a>
                    )}

                    <Link href="/" className="block">
                        <Button variant="outline" className="h-12 w-full rounded-xl font-medium">
                            <ShoppingBag className="h-5 w-5" /> Continuar comprando
                        </Button>
                    </Link>
                </div>
            </div>

            <PaymentStatusPoll enabled={shouldPoll} maxRefreshes={15} />
            <ClearCartOnSuccess enabled={canClearCart} />
        </div>
    )
}
