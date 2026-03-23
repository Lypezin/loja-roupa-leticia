import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ArrowLeft, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

const statusMap: Record<string, string> = {
    'paid': 'Pago',
    'processing': 'Processando',
    'shipped': 'Enviado',
    'delivered': 'Entregue',
    'cancelled': 'Cancelado',
}

const statusColor: Record<string, string> = {
    'paid': 'bg-blue-100 text-blue-700',
    'processing': 'bg-yellow-100 text-yellow-700',
    'shipped': 'bg-purple-100 text-purple-700',
    'delivered': 'bg-emerald-100 text-emerald-700',
    'cancelled': 'bg-red-100 text-red-700',
}

export default async function MeusPedidosPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/conta/login')
    }

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            id,
            total_amount,
            status,
            created_at,
            order_items (
                id,
                quantity,
                products ( name )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Button variant="ghost" className="mb-4 -ml-4 text-muted-foreground" asChild>
                    <Link href="/conta">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Minha Conta
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <Package className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
                </div>
            </div>

            {(!orders || orders.length === 0) ? (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 border rounded-2xl">
                    <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h2 className="text-xl font-medium mb-2">Nenhum pedido encontrado</h2>
                    <p className="text-muted-foreground mb-6">
                        Você ainda não fez nenhuma compra em nossa loja.
                    </p>
                    <Link href="/">
                        <Button>Ir para a loja</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow">
                            
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    Pedido realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="font-semibold text-lg flex items-center gap-3">
                                    {formatCurrency(order.total_amount)}
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor[order.status] || 'bg-zinc-100 text-zinc-700'}`}>
                                        {statusMap[order.status] || order.status}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-500 mt-2">
                                    {order.order_items?.map((item: any) => `${item.quantity}x ${item.products?.name}`).join(', ')}
                                </div>
                            </div>
                            
                            <div className="w-full md:w-auto">
                                <Button variant="outline" className="w-full md:w-auto" asChild>
                                    <Link href={`/conta/pedidos/${order.id}`}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver Detalhes
                                    </Link>
                                </Button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
