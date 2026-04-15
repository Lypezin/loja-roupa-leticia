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
            toast.success("Configuracoes de frete atualizadas.")
        } catch (error: unknown) {
            const err = error as Error
            toast.error(`Erro ao salvar logistica: ${err.message}`)
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
                description="Conecte o Melhor Envio, defina a origem dos envios da loja e acompanhe quais produtos ja estao prontos para cotacao."
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
                <MelhorEnvioConnection
                    melhorEnvio={melhorEnvio}
                    isDisconnecting={isDisconnecting}
                    onDisconnect={handleDisconnect}
                />

                <ShippingOperationalStatus
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

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Nome do remetente
                    </label>
                    <input
                        id="shipping_sender_name"
                        name="shipping_sender_name"
                        defaultValue={typeof settings.shipping_sender_name === "string" ? settings.shipping_sender_name : ""}
                        placeholder="Nome usado na postagem"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        E-mail do remetente
                    </label>
                    <input
                        id="shipping_sender_email"
                        name="shipping_sender_email"
                        defaultValue={typeof settings.shipping_sender_email === "string" ? settings.shipping_sender_email : ""}
                        placeholder="contato@loja.com"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_phone" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Telefone do remetente
                    </label>
                    <input
                        id="shipping_sender_phone"
                        name="shipping_sender_phone"
                        defaultValue={typeof settings.shipping_sender_phone === "string" ? settings.shipping_sender_phone : ""}
                        placeholder="+55 11 90000-0000"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_document" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        CPF ou CNPJ do remetente
                    </label>
                    <input
                        id="shipping_sender_document"
                        name="shipping_sender_document"
                        defaultValue={typeof settings.shipping_sender_document === "string" ? settings.shipping_sender_document : ""}
                        placeholder="Somente numeros ou formatado"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_address" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Rua do remetente
                    </label>
                    <input
                        id="shipping_sender_address"
                        name="shipping_sender_address"
                        defaultValue={typeof settings.shipping_sender_address === "string" ? settings.shipping_sender_address : ""}
                        placeholder="Rua ou avenida"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_number" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Numero do remetente
                    </label>
                    <input
                        id="shipping_sender_number"
                        name="shipping_sender_number"
                        defaultValue={typeof settings.shipping_sender_number === "string" ? settings.shipping_sender_number : ""}
                        placeholder="Ex.: 123"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_district" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Bairro do remetente
                    </label>
                    <input
                        id="shipping_sender_district"
                        name="shipping_sender_district"
                        defaultValue={typeof settings.shipping_sender_district === "string" ? settings.shipping_sender_district : ""}
                        placeholder="Bairro"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_complement" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Complemento do remetente
                    </label>
                    <input
                        id="shipping_sender_complement"
                        name="shipping_sender_complement"
                        defaultValue={typeof settings.shipping_sender_complement === "string" ? settings.shipping_sender_complement : ""}
                        placeholder="Sala, loja, referencia"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_city" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Cidade do remetente
                    </label>
                    <input
                        id="shipping_sender_city"
                        name="shipping_sender_city"
                        defaultValue={typeof settings.shipping_sender_city === "string" ? settings.shipping_sender_city : ""}
                        placeholder="Cidade"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_state" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        UF do remetente
                    </label>
                    <input
                        id="shipping_sender_state"
                        name="shipping_sender_state"
                        defaultValue={typeof settings.shipping_sender_state === "string" ? settings.shipping_sender_state : ""}
                        placeholder="SP"
                        maxLength={2}
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm uppercase text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="shipping_sender_state_register" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Inscricao estadual
                    </label>
                    <input
                        id="shipping_sender_state_register"
                        name="shipping_sender_state_register"
                        defaultValue={typeof settings.shipping_sender_state_register === "string" ? settings.shipping_sender_state_register : ""}
                        placeholder="Opcional"
                        className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-4 text-sm leading-6 text-zinc-700">
                <input
                    type="checkbox"
                    name="shipping_sender_non_commercial"
                    defaultChecked={settings.shipping_sender_non_commercial !== false}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-300"
                />
                <span>Tratar os envios como nao comerciais por padrao ao criar etiquetas via API.</span>
            </label>

            <FreeShippingSection threshold={readThresholdValue(settings.free_shipping_threshold)} />

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 md:p-5">
                <div className="flex items-center gap-2">
                    <PackageSearch className="h-4 w-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-zinc-950">Revisao rapida da operacao</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                    <li>1. A conta sandbox do Melhor Envio ja esta conectada e a cotacao respondeu em teste.</li>
                    <li>2. O CEP de origem precisa continuar no admin porque ele define o ponto de despacho da sua loja.</li>
                    <li>3. O calculo de frete depende de peso e dimensoes do pacote em cada produto.</li>
                    <li>4. Se algum produto ficar sem essas medidas, o carrinho bloqueia a cotacao para esse item.</li>
                </ul>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar logistica" />
        </form>
    )
}
