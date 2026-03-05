'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LayoutTemplate, Info, Mail, Send } from "lucide-react"
import { saveFooter } from "@/app/admin/(dashboard)/configuracoes/actions"
import { toast } from "sonner"
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
        <form action={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-8">
            <input type="hidden" name="id" value={settings.id || ''} />

            <SectionHeader
                icon={LayoutTemplate}
                title="Configuração do Rodapé"
                description="Personalize as informações institucionais e a chamada para sua newsletter."
            />

            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-zinc-400" />
                        <Label htmlFor="footer_about_text" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sobre a Loja (Rodapé)</Label>
                    </div>
                    <Textarea
                        id="footer_about_text"
                        name="footer_about_text"
                        defaultValue={settings.footer_about_text || ''}
                        rows={3}
                        className="rounded-xl border-zinc-200 focus-visible:ring-zinc-200 resize-none pt-3"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-zinc-50">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Send className="w-4 h-4 text-zinc-400" />
                            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Newsletter</h3>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer_newsletter_title" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Título Newsletter</Label>
                        <Input id="footer_newsletter_title" name="footer_newsletter_title" defaultValue={settings.footer_newsletter_title || ''} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer_newsletter_subtitle" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Subtítulo Newsletter</Label>
                        <Input id="footer_newsletter_subtitle" name="footer_newsletter_subtitle" defaultValue={settings.footer_newsletter_subtitle || ''} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Rodapé" />
        </form>
    )
}
