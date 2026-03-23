import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, CreditCard, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

const statusSteps = ['paid', 'processing', 'shipped', 'delivered']
const stepLabels: Record<string, string> = {
    paid: 'Pago',
    processing: 'Preparando',
    shipped: 'Enviado',
    delivered: 'Entregue',
}
const stepIcons = [CreditCard, Package, Truck, CheckCircle]

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

    if (!order) return <div className="text-center py-20">Pedido não encontrado.</div>

    // Índice atual do status para o tracker progressivo
    const currentStepIndex = statusSteps.indexOf(order.status)
    const isCancelled = order.status === 'cancelled'

    // Parsear endereço de entrega se existir
    const address = order.shipping_address
    const addressStr = address
        ? [address.line1, address.line2, address.city, address.state, address.postal_code, address.country]
            .filter(Boolean)
            .join(', ')
        : null

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
                <Link href="/conta/pedidos">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos Pedidos
                </Link>
            </Button>

            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Pedido #{order.id.split('-')[0].toUpperCase()}</h1>
                        <p className="text-sm text-muted-foreground">
                            Realizado em {new Date(order.created_at).toLocaleString('pt-BR')}
                        </p>
                    </div>
                    {isCancelled && (
                        <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-medium">
                            Cancelado
                        </span>
                    )}
                </div>

                <div className="p-6 space-y-8">
                    {/* Status Tracker Progressivo */}
                    {!isCancelled && (
                        <div className="flex bg-muted/40 p-4 rounded-xl border border-muted-foreground/10 items-center justify-between mx-auto">
                            {statusSteps.map((step, index) => {
                                const Icon = stepIcons[index]
                                const isCompleted = currentStepIndex >= index
                                const isLast = index === statusSteps.length - 1

                                return (
                                    <div key={step} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`p-3 rounded-full transition-colors ${
                                                isCompleted 
                                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                                                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'
                                            }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-xs font-medium ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                                                {stepLabels[step]}
                                            </span>
                                        </div>
                                        {!isLast && (
                                            <div className="flex-1 h-0.5 mx-2 -mt-6 rounded-full bg-zinc-200 dark:bg-zinc-700">
                                                <div className={`h-full rounded-full transition-all ${
                                                    currentStepIndex > index ? 'bg-emerald-500 w-full' : 'w-0'
                                                }`} />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Conteúdo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Package className="w-5 h-5"/> Produtos</h3>
                            <div className="divide-y border rounded-xl overflow-hidden">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                        <div>
                                            <div className="font-medium">{item.products?.name || 'Produto Removido'}</div>
                                            <div className="text-sm text-muted-foreground">Qtd: {item.quantity}</div>
                                        </div>
                                        <div className="font-semibold">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-xl p-5 space-y-4">
                                <h3 className="font-semibold border-b pb-2">Resumo Financeiro</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Subtotal dos Itens</span> <span>{formatCurrency(order.total_amount)}</span></div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span> <span>{formatCurrency(order.total_amount)}</span></div>
                                </div>
                            </div>

                            {/* Endereço de Entrega */}
                            {addressStr && (
                                <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-xl p-5 space-y-2">
                                    <h3 className="font-semibold border-b pb-2">Endereço de Entrega</h3>
                                    <p className="text-sm text-muted-foreground">{addressStr}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
