import Link from 'next/link'
import { ArrowLeft, Eye, Package } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

const statusMap: Record<string, string> = {
    paid: 'Pago',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    disputed: 'Em disputa',
}

const statusColor: Record<string, string> = {
    paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    shipped: 'bg-violet-100 text-violet-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-stone-200 text-stone-700',
    disputed: 'bg-amber-100 text-amber-700',
}

type OrderLine = {
    id: string
    quantity: number
    products?: { name?: string | null } | null
}

type OrderRecord = {
    id: string
    total_amount: number
    status: string
    created_at: string
    order_items?: OrderLine[]
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

    const orderList = (orders || []) as OrderRecord[]

    return (
        <div className="page-shell py-10 md:py-14">
            <div className="mx-auto max-w-5xl space-y-8">
                <Button variant="ghost" className="-ml-4 w-fit" asChild>
                    <Link href="/conta">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para minha conta
                    </Link>
                </Button>

                <div className="paper-panel rounded-[2rem] px-6 py-8 md:px-8">
                    <span className="eyebrow">historico</span>
                    <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Meus pedidos</h1>
                </div>

                {orderList.length === 0 ? (
                    <div className="surface-card rounded-[1.8rem] px-6 py-12 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                            <Package className="h-7 w-7" />
                        </div>
                        <h2 className="mt-6 font-display text-3xl text-foreground">Nenhum pedido ainda</h2>
                        <p className="mt-3 text-base leading-7 text-muted-foreground">
                            Quando você finalizar uma compra, ela aparece aqui com o status atualizado.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orderList.map((order) => (
                            <div key={order.id} className="surface-card rounded-[1.8rem] p-6">
                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                        <div className="mt-3 flex flex-wrap items-center gap-3">
                                            <p className="text-xl font-semibold text-foreground">{formatCurrency(order.total_amount)}</p>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[order.status] || 'bg-muted text-foreground'}`}>
                                                {statusMap[order.status] || order.status}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                            {(order.order_items || []).map((item) => `${item.quantity}x ${item.products?.name || 'Produto'}`).join(', ')}
                                        </p>
                                    </div>

                                    <Button variant="outline" className="w-full rounded-full md:w-auto" asChild>
                                        <Link href={`/conta/pedidos/${order.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver detalhes
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
