'use client'

import { useMemo, useState } from "react"
import { Clock, DollarSign, Link2, Loader2, MapPin, ShieldAlert, ShieldCheck, Truck } from "lucide-react"
import { toast } from "sonner"
import { disconnectMelhorEnvioAccount, saveLogistics } from "@/app/admin/(dashboard)/configuracoes/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { MelhorEnvioIntegrationStatus } from "@/types/shipping"
import { SaveButton, SectionHeader, showSuccess } from "./SettingsUI"

interface LogisticsSectionProps {
    settings: Record<string, string | number | null>
    melhorEnvio: MelhorEnvioIntegrationStatus
}

export function LogisticsSection({ settings, melhorEnvio }: LogisticsSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const [success, setSuccess] = useState(false)

    const environmentLabel = useMemo(
        () => melhorEnvio.environment === "production" ? "producao" : "sandbox",
        [melhorEnvio.environment],
    )

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await saveLogistics(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Logistica atualizada!")
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
        <form action={handleSubmit} className="space-y-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
            <input type="hidden" name="id" value={String(settings.id || "")} />

            <SectionHeader
                icon={Truck}
                title="Logistica e entrega"
                description="Configure regras de frete, conecte o Melhor Envio e ajuste o prazo operacional da loja."
            />

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
                            {melhorEnvio.connected
                                ? "A cotacao do carrinho usara a conta conectada do Melhor Envio neste ambiente."
                                : "Sem a conexao ativa, o carrinho nao consegue calcular PAC, SEDEX ou demais servicos do Melhor Envio."}
                        </p>
                        {melhorEnvio.connected && melhorEnvio.connected_at ? (
                            <p className="text-xs text-zinc-500">
                                Conectado em {new Date(melhorEnvio.connected_at).toLocaleString("pt-BR")}
                                {melhorEnvio.expires_at ? ` | token valido ate ${new Date(melhorEnvio.expires_at).toLocaleString("pt-BR")}` : ""}
                            </p>
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

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="shipping_origin_zip" className="text-xs font-bold uppercase tracking-wider text-zinc-400">CEP de origem</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input id="shipping_origin_zip" name="shipping_origin_zip" defaultValue={String(settings.shipping_origin_zip || "")} className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="processing_days" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dias de processamento</Label>
                    <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input id="processing_days" name="processing_days" type="number" min="0" defaultValue={Number(settings.processing_days || 0)} className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200" />
                    </div>
                    <p className="text-[10px] text-zinc-400">Dias uteis para preparar o pedido antes da transportadora.</p>
                </div>

                <div className="space-y-2 border-t border-zinc-100 pt-4 md:col-span-2">
                    <div className="mb-4 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Regras de frete gratis</h3>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Valor minimo para frete gratis</Label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">R$</span>
                        <Input id="free_shipping_threshold" name="free_shipping_threshold" type="number" step="0.01" min="0" defaultValue={Number(settings.free_shipping_threshold || 0)} className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200" />
                    </div>
                    <p className="text-[10px] text-zinc-400">
                        Quando atingido, a loja vai oferecer somente a opcao gratuita mais economica da cotacao.
                    </p>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar logistica" />
        </form>
    )
}
