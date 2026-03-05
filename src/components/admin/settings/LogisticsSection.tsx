'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, MapPin, Clock, DollarSign } from "lucide-react"
import { updateLogisticsSettings } from "@/app/admin/(dashboard)/configuracoes/actions"
import { toast } from "sonner"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface LogisticsSectionProps {
    settings: any
}

export function LogisticsSection({ settings }: LogisticsSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await updateLogisticsSettings(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Logística atualizada!")
        } catch (error: any) {
            toast.error(`Erro ao salvar logística: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-8">
            <input type="hidden" name="id" value={settings.id} />

            <SectionHeader
                icon={Truck}
                title="Logística e Entrega"
                description="Configure as regras de envio, CEP de origem e prazos de processamento dos pedidos."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                    <Label htmlFor="origin_postcode" className="text-xs font-bold uppercase tracking-wider text-zinc-400">CEP de Origem</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input id="origin_postcode" name="origin_postcode" defaultValue={settings.origin_postcode || ''} className="pl-10 h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="handling_days" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dias de Processamento</Label>
                    <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input id="handling_days" name="handling_days" type="number" defaultValue={settings.handling_days || 0} className="pl-10 h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <p className="text-[10px] text-zinc-400">Dias úteis para preparar o pedido antes do envio.</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-50 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Regras de Frete Grátis</h3>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Valor Mínimo para Frete Grátis</Label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">R$</span>
                        <Input id="free_shipping_threshold" name="free_shipping_threshold" type="number" step="0.01" defaultValue={settings.free_shipping_threshold || 0} className="pl-10 h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Logística" />
        </form>
    )
}
