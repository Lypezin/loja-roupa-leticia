import Link from "next/link"
import { AlertTriangle, Package, ShoppingBag } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { ClearCartOnSuccess } from "./ClearCart"
import { PaymentStatusPoll } from "./PaymentStatusPoll"
import { fetchPaymentAttempt, fetchOrderDetails, type PaymentAttemptRecord } from "./queries"
import { StatusSummary } from "./components/StatusSummary"

const PENDING_TIMEOUT_MINUTES = 10

function isExpiredPendingAttempt(attempt: PaymentAttemptRecord | null) {
    if (!attempt || attempt.status !== "pending") return false
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

    if (!checkoutRef) redirect("/")

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/conta/login?reason=checkout_login_required&next=${encodeURIComponent(`/sucesso?checkout_ref=${checkoutRef}`)}`)
    }

    const typedAttempt = await fetchPaymentAttempt(supabase, checkoutRef, user.id)
    const typedOrder = await fetchOrderDetails(supabase, checkoutRef, user.id)

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

    const currentStatus = typedOrder?.status || typedAttempt?.status || "pending"
    const isFailureState = currentStatus === "failed" || currentStatus === "cancelled"
    const isWarningState = currentStatus === "refunded" || currentStatus === "disputed"
    const isExpiredPending = isExpiredPendingAttempt(typedAttempt)
    const shouldPoll = Boolean(typedAttempt && !typedOrder && !isFailureState && !isWarningState && !isExpiredPending)
    const receiptUrl = typedOrder?.payment_receipt_url || typedAttempt?.receipt_url || null
    const hasConfirmedOrder = Boolean(typedOrder) && !isFailureState && !isWarningState
    const canClearCart = Boolean(typedOrder)
    const waitingWebhook = !typedOrder && !isFailureState && !isWarningState && !isExpiredPending

    return (
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20">
            <div className="max-w-lg w-full rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
                
                <StatusSummary
                    order={typedOrder}
                    attempt={typedAttempt}
                    isFailureState={isFailureState}
                    isWarningState={isWarningState}
                    isExpiredPending={isExpiredPending}
                    hasConfirmedOrder={hasConfirmedOrder}
                    checkoutRef={checkoutRef}
                />

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
                            <Button variant="outline" className="h-12 w-full rounded-xl font-medium">Ver recibo</Button>
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
