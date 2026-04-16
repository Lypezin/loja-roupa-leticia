import Link from "next/link"
import { AlertTriangle, Package, RefreshCcw, ShoppingBag } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { reconcileAbacatePayAttempt } from "@/lib/abacatepay/reconcile"
import { createClient } from "@/lib/supabase/server"
import { getSafeAbsoluteUrl } from "@/lib/url-safety"
import { ClearCartOnSuccess } from "./ClearCart"
import { PaymentStatusPoll } from "./PaymentStatusPoll"
import { StatusSummary } from "./components/StatusSummary"
import {
    fetchOrderDetails,
    fetchPaymentAttempt,
    fetchPublicOrderDetails,
    fetchPublicPaymentAttempt,
    type PaymentAttemptRecord,
} from "./queries"

const PENDING_TIMEOUT_MINUTES = 10

function isExpiredPendingAttempt(attempt: PaymentAttemptRecord | null) {
    if (!attempt || (attempt.status !== "pending" && attempt.status !== "creating")) {
        return false
    }

    const createdAt = new Date(attempt.created_at).getTime()
    const timeoutInMs = PENDING_TIMEOUT_MINUTES * 60 * 1000

    return Number.isFinite(createdAt) && Date.now() - createdAt > timeoutInMs
}

export default async function SucessoPage({
    searchParams,
}: {
    searchParams: Promise<{ checkout_ref?: string; access_token?: string }>
}) {
    const params = await searchParams
    const checkoutRef = params?.checkout_ref
    const accessToken = params?.access_token?.trim() || null

    if (!checkoutRef) {
        redirect("/")
    }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user && !accessToken) {
        redirect(`/conta/login?reason=checkout_login_required&next=${encodeURIComponent(`/sucesso?checkout_ref=${checkoutRef}`)}`)
    }

    let typedAttempt = user ? await fetchPaymentAttempt(supabase, checkoutRef, user.id) : null
    let typedOrder = user ? await fetchOrderDetails(supabase, checkoutRef, user.id) : null

    if ((!typedAttempt && !typedOrder) && accessToken) {
        typedAttempt = await fetchPublicPaymentAttempt(checkoutRef, accessToken)

        if (typedAttempt) {
            typedOrder = await fetchPublicOrderDetails(checkoutRef)
        }
    }

    if (user && typedAttempt && !typedOrder && (typedAttempt.status === "pending" || typedAttempt.status === "creating")) {
        try {
            await reconcileAbacatePayAttempt(checkoutRef, user.id)
        } catch (error) {
            console.error("Falha ao reconciliar checkout pendente na pagina de sucesso:", error)
        }

        typedAttempt = await fetchPaymentAttempt(supabase, checkoutRef, user.id)
        typedOrder = await fetchOrderDetails(supabase, checkoutRef, user.id)
    }

    if (!typedAttempt && !typedOrder) {
        return (
            <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20">
                <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Checkout invalido</h1>
                    <p className="mt-3 text-muted-foreground">Nao foi possivel localizar esta tentativa de pagamento.</p>
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
    const isSupersededState = currentStatus === "superseded"
    const isManualReviewState = currentStatus === "paid_manual_review"
    const isWarningState = currentStatus === "refunded" || currentStatus === "disputed" || isSupersededState || isManualReviewState
    const isExpiredPending = isExpiredPendingAttempt(typedAttempt)
    const shouldPoll = Boolean(typedAttempt && !typedOrder && !isFailureState && !isWarningState && !isExpiredPending)
    const receiptUrl = getSafeAbsoluteUrl(typedOrder?.payment_receipt_url || typedAttempt?.receipt_url || null)
    const hasConfirmedOrder = Boolean(typedOrder) && !isFailureState && !isWarningState
    const canClearCart = hasConfirmedOrder
    const waitingWebhook = !typedOrder && !isFailureState && !isWarningState && !isExpiredPending
    const orderDetailsHref = typedOrder
        ? user
            ? `/conta/pedidos/${typedOrder.id}`
            : `/conta/login?reason=checkout_login_required&next=${encodeURIComponent(`/conta/pedidos/${typedOrder.id}`)}`
        : null

    return (
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-20">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
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
                    {hasConfirmedOrder && typedOrder && orderDetailsHref ? (
                        <Link href={orderDetailsHref}>
                            <Button className="h-12 w-full rounded-xl bg-foreground font-medium text-background hover:bg-foreground/90">
                                <Package className="h-5 w-5" /> {user ? "Ver pedido" : "Entrar para acompanhar pedido"}
                            </Button>
                        </Link>
                    ) : isFailureState || isSupersededState ? (
                        <Link href="/carrinho">
                            <Button className="h-12 w-full rounded-xl bg-foreground font-medium text-background hover:bg-foreground/90">
                                <ShoppingBag className="h-5 w-5" /> {isSupersededState ? "Gerar novo link" : "Voltar ao carrinho"}
                            </Button>
                        </Link>
                    ) : isWarningState && typedOrder && orderDetailsHref ? (
                        <Link href={orderDetailsHref}>
                            <Button className="h-12 w-full rounded-xl bg-foreground font-medium text-background hover:bg-foreground/90">
                                <Package className="h-5 w-5" /> {user ? "Ver detalhes do pedido" : "Entrar para acompanhar pedido"}
                            </Button>
                        </Link>
                    ) : isManualReviewState ? (
                        <Button disabled className="h-12 w-full rounded-xl font-medium">
                            <Package className="h-5 w-5" /> Em analise manual
                        </Button>
                    ) : (
                        <Button disabled className="h-12 w-full rounded-xl font-medium">
                            <Package className="h-5 w-5" /> {waitingWebhook ? "Aguardando confirmacao" : "Em verificacao"}
                        </Button>
                    )}

                    {isExpiredPending && (
                        <Link
                            href={`/sucesso?checkout_ref=${encodeURIComponent(checkoutRef)}${accessToken ? `&access_token=${encodeURIComponent(accessToken)}` : ""}`}
                            className="block"
                        >
                            <Button variant="outline" className="h-12 w-full rounded-xl font-medium">
                                <RefreshCcw className="h-5 w-5" /> Atualizar status agora
                            </Button>
                        </Link>
                    )}

                    {receiptUrl && (
                        <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="block">
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
