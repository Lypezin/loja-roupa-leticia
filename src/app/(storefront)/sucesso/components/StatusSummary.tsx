import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { OrderRecord, PaymentAttemptRecord } from "../queries"

type StatusSummaryProps = {
    order: OrderRecord | null
    attempt: PaymentAttemptRecord | null
    isFailureState: boolean
    isWarningState: boolean
    isExpiredPending: boolean
    hasConfirmedOrder: boolean
    checkoutRef: string
}

export function StatusSummary({
    order,
    attempt,
    isFailureState,
    isWarningState,
    isExpiredPending,
    hasConfirmedOrder,
    checkoutRef,
}: StatusSummaryProps) {
    const currentStatus = order?.status || attempt?.status || "pending"
    const isSupersededState = currentStatus === "superseded"
    const isManualReviewState = currentStatus === "paid_manual_review"
    const title = hasConfirmedOrder
        ? "Pedido confirmado!"
        : isFailureState
            ? "Pagamento nao concluido"
            : currentStatus === "refunded"
                ? "Pagamento reembolsado"
                : currentStatus === "disputed"
                    ? "Pagamento em analise"
                    : isSupersededState
                        ? "Link de pagamento substituido"
                        : isManualReviewState
                            ? "Pagamento recebido em analise manual"
                            : isExpiredPending
                                ? "Pagamento em verificacao"
                                : "Pagamento recebido"

    const description = hasConfirmedOrder
        ? "Seu pagamento foi confirmado e o pedido ja esta salvo na sua conta."
        : isFailureState
            ? "Nao conseguimos confirmar este pagamento. Voce pode voltar ao carrinho e tentar novamente."
            : currentStatus === "refunded"
                ? "O pagamento foi reembolsado e nao gerou um pedido ativo."
                : currentStatus === "disputed"
                    ? "Recebemos uma sinalizacao sobre este pagamento e o pedido foi pausado para analise."
                    : isSupersededState
                        ? "Este link foi substituido por outro mais recente. Use o ultimo link enviado no WhatsApp para evitar cobranca duplicada."
                        : isManualReviewState
                            ? "Recebemos o pagamento, mas precisamos conferir manualmente porque o link antigo foi usado ou o estoque mudou apos a geracao da cobranca."
                            : isExpiredPending
                                ? "O pagamento foi recebido, mas a confirmacao automatica demorou mais do que o esperado. Se o valor ja saiu da sua conta, fale com a loja e informe o codigo do checkout."
                                : "Aguardando a confirmacao final da AbacatePay. Esta pagina atualiza sozinha em alguns segundos."

    const paymentMethod = order?.payment_method || attempt?.payment_method
    const methodLabel = paymentMethod?.includes(",") ? "Metodos aceitos" : "Metodo"

    const Icon = hasConfirmedOrder ? CheckCircle : isFailureState ? XCircle : isWarningState || isExpiredPending ? AlertTriangle : CheckCircle
    const iconWrapperClassName = hasConfirmedOrder ? "bg-emerald-100" : isFailureState ? "bg-red-100" : isWarningState || isExpiredPending ? "bg-amber-100" : "bg-emerald-100"
    const iconClassName = hasConfirmedOrder ? "text-emerald-600" : isFailureState ? "text-red-600" : isWarningState || isExpiredPending ? "text-amber-600" : "text-emerald-600"

    const orderItems = order?.order_items || []
    const attemptItems = attempt?.trusted_items || []

    return (
        <>
            <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${iconWrapperClassName}`}>
                <Icon className={`h-10 w-10 ${iconClassName}`} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-3 text-muted-foreground">{description}</p>

            <div className="mt-6 space-y-3 rounded-xl border bg-muted/40 p-4 text-left">
                <h3 className="text-sm font-semibold text-foreground">Resumo da compra</h3>

                <div className="space-y-2">
                    {order ? orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between gap-3 text-sm">
                            <span className="min-w-0 text-muted-foreground">{item.quantity}x {item.products?.name || "Produto"}</span>
                            <span className="shrink-0 font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    )) : attemptItems.map((item, index) => (
                        <div key={`${checkoutRef}-${index}`} className="flex justify-between gap-3 text-sm">
                            <span className="min-w-0 text-muted-foreground">{item.quantity || 0}x {item.product_name || "Produto"}</span>
                            <span className="shrink-0 font-medium">{formatCurrency((item.unit_price || 0) * (item.quantity || 0))}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order?.total_amount || attempt?.total_amount || 0)}</span>
                </div>

                {paymentMethod && (
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {methodLabel}: {paymentMethod}
                    </p>
                )}

                {!order && (
                    <p className="text-xs text-muted-foreground">
                        Codigo do checkout: <span className="font-medium text-foreground">{checkoutRef}</span>
                    </p>
                )}
            </div>
        </>
    )
}
