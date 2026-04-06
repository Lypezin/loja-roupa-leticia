import Link from 'next/link'
import { ArrowLeft, CheckCircle, CreditCard, Package, Truck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

const statusSteps = ['paid', 'processing', 'shipped', 'delivered']
const stepLabels: Record<string, string> = {
    paid: 'Pago',
    processing: 'Preparando',
    shipped: 'Enviado',
    delivered: 'Entregue',
}

const stepIcons = [CreditCard, Package, Truck, CheckCircle]

type OrderItem = {
    id: string
    quantity: number
    price: number
    products?: { id?: string | null; name?: string | null } | null
}

export default async function DetalhesPedidoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/conta/login')

    const { data: order } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                id,
                quantity,
                price,
                products ( id, name )
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!order) {
        return <div className="page-shell py-20 text-center">Pedido não encontrado.</div>
    }

    const currentStepIndex = statusSteps.indexOf(order.status)
    const isCancelled = order.status === 'cancelled'
    const orderItems = (order.order_items || []) as OrderItem[]

    const address = order.shipping_address && typeof order.shipping_address === 'object' && !Array.isArray(order.shipping_address)
        ? order.shipping_address as Record<string, string | null | undefined>
        : null

    const addressStr = address
        ? [address.line1, address.line2, address.city, address.state, address.postal_code, address.country]
            .filter(Boolean)
            .join(', ')
        : null

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="mx-auto max-w-5xl space-y-8">
                <Button variant="ghost" className="-ml-4 w-fit" asChild>
                    <Link href="/conta/pedidos">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar aos pedidos
                    </Link>
                </Button>

                <div className="paper-panel rounded-[2rem] px-6 py-8 md:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="eyebrow">pedido</span>
                            <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
                                #{order.id.split('-')[0].toUpperCase()}
                            </h1>
                            <p className="mt-3 text-sm text-muted-foreground">
                                Realizado em {new Date(order.created_at).toLocaleString('pt-BR')}
                            </p>
                        </div>
                        {isCancelled && (
                            <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-medium text-red-700">
                                Cancelado
                            </span>
                        )}
                    </div>
                </div>

                {!isCancelled && (
                    <div className="surface-card rounded-[1.8rem] p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            {statusSteps.map((step, index) => {
                                const Icon = stepIcons[index]
                                const isCompleted = currentStepIndex >= index

                                return (
                                    <div key={step} className="surface-card-soft rounded-[1.4rem] p-4">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <p className="mt-4 text-sm font-semibold text-foreground">{stepLabels[step]}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="surface-card rounded-[1.8rem] p-6">
                        <h2 className="font-display text-3xl text-foreground">Itens do pedido</h2>
                        <div className="mt-6 space-y-4">
                            {orderItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between rounded-[1.2rem] border border-border bg-card px-4 py-4">
                                    <div>
                                        <p className="font-medium text-foreground">{item.products?.name || 'Produto removido'}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="surface-card rounded-[1.8rem] p-6">
                            <h2 className="font-display text-3xl text-foreground">Resumo</h2>
                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.total_amount)}</span>
                                </div>
                                <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-foreground">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {addressStr && (
                            <div className="surface-card rounded-[1.8rem] p-6">
                                <h2 className="font-display text-3xl text-foreground">Entrega</h2>
                                <p className="mt-4 text-sm leading-7 text-muted-foreground">{addressStr}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
