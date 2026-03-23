import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Box, CheckCircle, CreditCard, Eye, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

const statusTranslation: Record<string, string> = {
    'paid': 'Pagamento Confirmado',
    'processing': 'Processando Preparo',
    'shipped': 'A Caminho',
    'delivered': 'Pacote Entregue',
    'cancelled': 'Pedido Cancelado',
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
                products ( id, name, slugs )
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!order) return <div className="text-center py-20">Pedido não encontrado.</div>

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
                </div>

                <div className="p-6 space-y-8">
                    {/* Status Tracker Básico */}
                    <div className="flex bg-muted/40 p-4 rounded-xl border border-muted-foreground/10 items-center justify-between mx-auto">
                        <div className="flex flex-col items-center gap-2">
                             <div className={`p-3 rounded-full ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}><CreditCard className="w-6 h-6" /></div>
                             <span className="text-xs font-medium">Pago</span>
                        </div>
                        <div className="flex-1 h-1 bg-zinc-100 -mt-6">
                            <div className={`h-full ${order.status !== 'paid' ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <div className={`p-3 rounded-full ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}><Truck className="w-6 h-6" /></div>
                             <span className="text-xs font-medium">Enviado</span>
                        </div>
                        <div className="flex-1 h-1 bg-zinc-100 -mt-6">
                            <div className={`h-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <div className={`p-3 rounded-full ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}><CheckCircle className="w-6 h-6" /></div>
                             <span className="text-xs font-medium">Entregue</span>
                        </div>
                    </div>

                    {/* Resumo */}
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
                                            {formatCurrency(item.price)}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
