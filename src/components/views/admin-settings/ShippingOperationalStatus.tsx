import Link from "next/link"
import { ShieldCheck, AlertTriangle } from "lucide-react"
import type { ShippingCoverageSummary } from "@/types/shipping"

interface ShippingOperationalStatusProps {
    shippingReady: boolean
    hasOriginZip: boolean
    originZip: string
    shippingCoverage: ShippingCoverageSummary
}

export function ShippingOperationalStatus({ 
    shippingReady, 
    hasOriginZip, 
    originZip, 
    shippingCoverage 
}: ShippingOperationalStatusProps) {
    return (
        <div className={`rounded-2xl border p-5 ${shippingReady ? "border-emerald-200 bg-emerald-50/80" : "border-amber-200 bg-amber-50/80"}`}>
            <div className="flex items-center gap-2">
                {shippingReady ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">Status operacional</p>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-zinc-950">
                {shippingReady ? "Loja pronta para cotar frete" : "Faltam ajustes para o frete"}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                <li className="flex items-start justify-between gap-3">
                    <span>Conta do Melhor Envio</span>
                    <strong>{shippingReady ? "OK" : "Verificar"}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                    <span>CEP de origem da loja</span>
                    <strong>{hasOriginZip ? originZip : "Pendente"}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                    <span>Produtos com medidas</span>
                    <strong>{shippingCoverage.productsReadyForShipping}/{shippingCoverage.totalProducts}</strong>
                </li>
            </ul>
            {shippingCoverage.productsMissingShippingData > 0 && (
                <p className="mt-4 text-xs leading-5 text-zinc-600">
                    {shippingCoverage.productsMissingShippingData} produto(s) ainda não têm peso e dimensões.
                    Ajuste isso em <Link href="/admin/produtos" className="font-semibold text-zinc-950 underline underline-offset-4">Produtos</Link>.
                </p>
            )}
        </div>
    )
}
