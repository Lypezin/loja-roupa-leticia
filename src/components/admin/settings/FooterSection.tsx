'use client'

import { useState } from "react"
import { Info, LayoutTemplate } from "lucide-react"
import { toast } from "sonner"
import { saveFooter } from "@/app/admin/(dashboard)/configuracoes/actions"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface FooterSectionProps {
    settings: Record<string, string | null>
}

export function FooterSection({ settings }: FooterSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await saveFooter(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Rodapé atualizado!")
        } catch (error: unknown) {
            const err = error as Error
            toast.error(`Erro ao salvar rodapé: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
            <input type="hidden" name="id" value={settings.id || ''} />

            <SectionHeader
                icon={LayoutTemplate}
                title="Configuração do rodapé"
                description="Personalize as informações institucionais exibidas no rodapé da loja."
            />

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-zinc-400" />
                    <Label htmlFor="footer_about_text" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sobre a loja</Label>
                </div>
                <Textarea
                    id="footer_about_text"
                    name="footer_about_text"
                    defaultValue={settings.footer_about_text || ''}
                    rows={4}
                    className="resize-none rounded-xl border-zinc-200 pt-3 focus-visible:ring-zinc-200"
                />
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Rodapé" />
        </form>
    )
}
