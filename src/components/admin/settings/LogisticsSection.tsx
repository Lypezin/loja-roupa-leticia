'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck } from "lucide-react"
import { saveLogistics } from "@/app/admin/(dashboard)/configuracoes/actions"
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
            const res = await saveLogistics(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Logística salva com sucesso!")
        } catch (error: any) {
            toast.error(`Erro ao salvar logística: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
            <input type="hidden" name="id" value={settings.id} />
            <SectionHeader icon={Truck} title="Logística e Frete" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="shipping_origin_zip">CEP de Origem</Label>
                    <Input
                        id="shipping_origin_zip"
                        name="shipping_origin_zip"
                        placeholder="01001000"
                        defaultValue={settings.shipping_origin_zip || ''}
                        className="rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold">Frete Grátis Acima de (R$)</Label>
                    <Input
                        id="free_shipping_threshold"
                        name="free_shipping_threshold"
                        type="number"
                        step="0.01"
                        placeholder="Desativado"
                        defaultValue={settings.free_shipping_threshold || ''}
                        className="rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="processing_days">Preparação (Dias úteis)</Label>
                    <Input
                        id="processing_days"
                        name="processing_days"
                        type="number"
                        min="0"
                        defaultValue={settings.processing_days ?? 2}
                        className="rounded-xl"
                    />
                </div>
            </div>
            <p className="text-xs text-zinc-400">
                * Esses dados serão utilizados para calcular as etiquetas de frete.
            </p>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Logística" />
        </form>
    )
}
