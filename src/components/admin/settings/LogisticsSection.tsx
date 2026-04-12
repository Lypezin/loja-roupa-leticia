'use client'

import Link from "next/link"
import { useMemo, useState } from "react"
import { AlertTriangle, Clock, DollarSign, Link2, Loader2, MapPin, PackageSearch, ShieldAlert, ShieldCheck, Truck } from "lucide-react"
import { toast } from "sonner"
import { disconnectMelhorEnvioAccount, saveLogistics } from "@/app/admin/(dashboard)/configuracoes/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { MelhorEnvioIntegrationStatus, ShippingCoverageSummary } from "@/types/shipping"
import { SaveButton, SectionHeader, showSuccess } from "./SettingsUI"

interface LogisticsSectionProps {
    settings: Record<string, string | number | null>
    melhorEnvio: MelhorEnvioIntegrationStatus
    shippingCoverage: ShippingCoverageSummary
}

function readStringValue(value: string | number | null | undefined) {
    return typeof value === "string" ? value : ""
}

function readThresholdValue(value: string | number | null | undefined) {
    if (typeof value === "number") {
        return value > 0 ? String(value) : ""
    }

    if (typeof value === "string") {
        const parsedValue = Number.parseFloat(value)
        return Number.isFinite(parsedValue) && parsedValue > 0 ? value : ""
    }

    return ""
}

export function LogisticsSection({ settings, melhorEnvio, shippingCoverage }: LogisticsSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const [success, setSuccess] = useState(false)

    const environmentLabel = useMemo(
        () => melhorEnvio.environment === "production" ? "produção" : "sandbox",
        [melhorEnvio.environment],
    )

    const hasOriginZip = Boolean(readStringValue(settings.shipping_origin_zip).trim())
    const shippingReady = melhorEnvio.connected
        && hasOriginZip
        && shippingCoverage.productsMissingShippingData === 0
        && shippingCoverage.totalProducts > 0

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await saveLogistics(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Configurações de frete atualizadas.")
        } catch (error: unknown) {
            const err = error as Error
            toast.error(`Erro ao salvar logística: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisconnect = async () => {
        setIsDisconnecting(true)
        try {
            const res = await disconnectMelhorEnvioAccount()
            if (res?.error) throw new Error(res.error)
            toast.success("Conta do Melhor Envio desconectada.")
            window.location.reload()
        } catch (error: unknown) {
            const err = error as Error
            toast.error(`Erro ao desconectar: ${err.message}`)
        } finally {
            setIsDisconnecting(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-8">
            <input type="hidden" name="id" value={String(settings.id || "")} />

            <SectionHeader
                icon={Truck}
                title="Frete e despacho"
                description="Conecte o Melhor Envio, defina a origem dos envios da loja e acompanhe quais produtos já estão prontos para cotação."
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {melhorEnvio.connected ? (
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                ) : (
                                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                                )}
                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                                    Melhor Envio ({environmentLabel})
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-950">
                                {melhorEnvio.connected ? "Conta conectada" : "Conecte sua conta"}
                            </h3>
                            <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                                O Melhor Envio fornece as transportadoras e a cotação. Já o CEP de origem e as medidas dos produtos continuam sendo responsabilidade da loja, porque a plataforma precisa saber de onde o pacote sai e qual volume está sendo enviado.
                            </p>
                            {melhorEnvio.connected ? (
                                <div className="space-y-1 text-xs text-zinc-500">
                                    {melhorEnvio.account_name ? (
                                        <p>Conta: {melhorEnvio.account_name}</p>
                                    ) : null}
                                    {melhorEnvio.account_email ? (
                                        <p>E-mail conectado: {melhorEnvio.account_email}</p>
                                    ) : null}
                                    {melhorEnvio.connected_at ? (
                                        <p>
                                            Conectado em {new Date(melhorEnvio.connected_at).toLocaleString("pt-BR")}
                                            {melhorEnvio.expires_at ? ` | token válido até ${new Date(melhorEnvio.expires_at).toLocaleString("pt-BR")}` : ""}
                                        </p>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="button"
                                variant={melhorEnvio.connected ? "outline" : "default"}
                                className="rounded-full"
                                onClick={() => {
                                    window.location.href = "/api/integrations/melhor-envio/connect"
                                }}
                            >
                                <Link2 className="h-4 w-4" />
                                {melhorEnvio.connected ? "Reconectar conta" : "Conectar Melhor Envio"}
                            </Button>

                            {melhorEnvio.connected ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-full"
                                    disabled={isDisconnecting}
                                    onClick={handleDisconnect}
                                >
                                    {isDisconnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    Desconectar
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>

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
                            <strong>{melhorEnvio.connected ? "OK" : "Pendente"}</strong>
                        </li>
                        <li className="flex items-start justify-between gap-3">
                            <span>CEP de origem da loja</span>
                            <strong>{hasOriginZip ? readStringValue(settings.shipping_origin_zip) : "Pendente"}</strong>
                        </li>
                        <li className="flex items-start justify-between gap-3">
                            <span>Produtos com medidas</span>
                            <strong>{shippingCoverage.productsReadyForShipping}/{shippingCoverage.totalProducts}</strong>
                        </li>
                    </ul>
                    {shippingCoverage.productsMissingShippingData > 0 ? (
                        <p className="mt-4 text-xs leading-5 text-zinc-600">
                            {shippingCoverage.productsMissingShippingData} produto(s) ainda não têm peso e dimensões.
                            Ajuste isso em <Link href="/admin/produtos" className="font-semibold text-zinc-950 underline underline-offset-4">Produtos</Link>.
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="shipping_origin_zip" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        CEP de origem do despacho
                    </Label>
                    <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                            id="shipping_origin_zip"
                            name="shipping_origin_zip"
                            defaultValue={readStringValue(settings.shipping_origin_zip)}
                            placeholder="Ex.: 07081-170"
                            className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200"
                        />
                    </div>
                    <p className="text-[11px] leading-5 text-zinc-500">
                        Use o CEP do local de onde os pacotes realmente saem. Mesmo com a conta conectada no Melhor Envio, a plataforma precisa dessa origem para cotar frete corretamente.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="processing_days" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Dias de preparação
                    </Label>
                    <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                            id="processing_days"
                            name="processing_days"
                            type="number"
                            min="0"
                            defaultValue={Number(settings.processing_days || 2)}
                            className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200"
                        />
                    </div>
                    <p className="text-[11px] leading-5 text-zinc-500">
                        Esse prazo é somado ao prazo da transportadora para refletir o tempo de separação e embalagem.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold text-zinc-950">Frete grátis</h3>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                    Deixe em branco para desativar. Quando esse valor é atingido, a loja oferece a opção mais econômica como frete grátis.
                </p>
                <div className="mt-4 max-w-sm space-y-2">
                    <Label htmlFor="free_shipping_threshold" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Pedido mínimo para frete grátis
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">R$</span>
                        <Input
                            id="free_shipping_threshold"
                            name="free_shipping_threshold"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={readThresholdValue(settings.free_shipping_threshold)}
                            placeholder="Ex.: 299,90"
                            className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5">
                <div className="flex items-center gap-2">
                    <PackageSearch className="h-4 w-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-zinc-950">Revisão rápida da operação</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                    <li>1. A conta sandbox do Melhor Envio já está conectada e a cotação respondeu em teste.</li>
                    <li>2. O CEP de origem precisa continuar no admin porque ele define o ponto de despacho da sua loja.</li>
                    <li>3. O cálculo de frete depende de peso e dimensões do pacote em cada produto.</li>
                    <li>4. Se algum produto ficar sem essas medidas, o carrinho bloqueia a cotação para esse item.</li>
                </ul>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar logística" />
        </form>
    )
}
