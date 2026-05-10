import Link from "next/link"
import { AlertTriangle, ShieldCheck } from "lucide-react"
import type { ShippingCoverageSummary } from "@/types/shipping"

interface ShippingOperationalStatusProps {
    isConnected: boolean
    shippingReady: boolean
    hasShipmentScopes: boolean
    hasSenderProfile: boolean
    hasOriginZip: boolean
    originZip: string
    missingScopes: string[]
    shippingCoverage: ShippingCoverageSummary
}

export function ShippingOperationalStatus({
    isConnected,
    shippingReady,
    hasShipmentScopes,
    hasSenderProfile,
    hasOriginZip,
    originZip,
    missingScopes,
    shippingCoverage,
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
                {shippingReady ? "Loja pronta para cotar, cobrar e despachar" : "Faltam ajustes para frete e despacho"}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                <li className="flex items-start justify-between gap-3">
                    <span>Conta do Melhor Envio</span>
                    <strong>{isConnected ? "Conectada" : "Pendente"}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                    <span>CEP de origem da loja</span>
                    <strong>{hasOriginZip ? originZip : "Pendente"}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                    <span>Escopos para etiqueta</span>
                    <strong>{hasShipmentScopes ? "Liberados" : "Incompletos"}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                    <span>Cadastro do remetente</span>
                    <strong>{hasSenderProfile ? "Completo" : "Pendente"}</strong>
                </li>
                <li className="flex items-start justify-between gap-3">
                    <span>Produtos com medidas</span>
                    <strong>{shippingCoverage.productsReadyForShipping}/{shippingCoverage.totalProducts}</strong>
                </li>
            </ul>

            {!hasShipmentScopes && missingScopes.length > 0 && (
                <p className="mt-4 text-xs leading-5 text-zinc-600">
                    Reconecte o Melhor Envio para liberar os escopos de etiqueta: {missingScopes.join(", ")}.
                </p>
            )}

            {!hasSenderProfile && (
                <p className="mt-4 text-xs leading-5 text-zinc-600">
                    Preencha os dados do remetente para conseguir emitir etiquetas automaticamente.
                </p>
            )}

            {shippingCoverage.productsMissingShippingData > 0 && (
                <p className="mt-4 text-xs leading-5 text-zinc-600">
                    {shippingCoverage.productsMissingShippingData} produto(s) ainda nao tem peso e dimensoes.
                    {" "}
                    Ajuste isso em{" "}
                    <Link href="/admin/produtos" className="font-semibold text-zinc-950 underline underline-offset-4">
                        Produtos
                    </Link>
                    .
                </p>
            )}
        </div>
    )
}
