'use client'

import { useState } from "react"
import { PackageSearch, Truck } from "lucide-react"
import { toast } from "sonner"
import { disconnectMelhorEnvioAccount, saveLogistics } from "@/app/admin/(dashboard)/configuracoes/actions"
import type { MelhorEnvioIntegrationStatus, ShippingCoverageSummary } from "@/types/shipping"
import { SaveButton, SectionHeader, showSuccess } from "./SettingsUI"
import { readStringValue, readThresholdValue } from "@/components/views/admin-settings/LogisticsUtils"
import { MelhorEnvioConnection } from "@/components/views/admin-settings/MelhorEnvioConnection"
import { ShippingOperationalStatus } from "@/components/views/admin-settings/ShippingOperationalStatus"
import { OriginAndProcessingFields } from "@/components/views/admin-settings/OriginAndProcessingFields"
import { FreeShippingSection } from "@/components/views/admin-settings/FreeShippingSection"
import { SenderAddressFields } from "@/components/views/admin-settings/SenderAddressFields"

interface LogisticsSectionProps {
    settings: Record<string, string | number | boolean | null>
    melhorEnvio: MelhorEnvioIntegrationStatus
    shippingCoverage: ShippingCoverageSummary
}

export function LogisticsSection({ settings, melhorEnvio, shippingCoverage }: LogisticsSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const [success, setSuccess] = useState(false)

    const originZip = readStringValue(settings.shipping_origin_zip)
    const hasOriginZip = Boolean(originZip.trim())
    const shippingReady = melhorEnvio.connected
        && hasOriginZip
        && shippingCoverage.productsMissingShippingData === 0
        && shippingCoverage.totalProducts > 0

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await saveLogistics(formData)
            if (res?.error) {
                throw new Error(res.error)
            }

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
            if (res?.error) {
                throw new Error(res.error)
            }

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
        <form action={handleSubmit} className="min-w-0 space-y-8 rounded-[1.45rem] border border-zinc-200/80 bg-white/90 p-4 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:rounded-[1.8rem] md:p-8">
            <input type="hidden" name="id" value={String(settings.id || "")} />

            <SectionHeader
                icon={Truck}
                title="Frete e despacho"
                description="Conecte o Melhor Envio, defina a origem dos envios da loja e acompanhe quais produtos já estão prontos para cotação."
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
                <MelhorEnvioConnection
                    melhorEnvio={melhorEnvio}
                    isDisconnecting={isDisconnecting}
                    onDisconnect={handleDisconnect}
                />

                <ShippingOperationalStatus
                    isConnected={melhorEnvio.connected}
                    shippingReady={shippingReady}
                    hasOriginZip={hasOriginZip}
                    originZip={originZip}
                    shippingCoverage={shippingCoverage}
                />
            </div>

            <OriginAndProcessingFields
                originZip={originZip}
                processingDays={Number(settings.processing_days || 2)}
            />

            <SenderAddressFields settings={settings} />

            <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-4 text-sm leading-6 text-zinc-700">
                <input
                    type="checkbox"
                    name="shipping_sender_non_commercial"
                    defaultChecked={settings.shipping_sender_non_commercial !== false}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-300"
                />
                <span>Tratar os envios como não comerciais por padrão ao criar etiquetas via API.</span>
            </label>

            <FreeShippingSection threshold={readThresholdValue(settings.free_shipping_threshold)} />

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 md:p-5">
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
