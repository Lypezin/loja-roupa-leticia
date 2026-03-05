'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import { saveFooter } from "@/app/admin/(dashboard)/configuracoes/actions"
import { toast } from "sonner"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface FooterSectionProps {
    settings: any
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
            toast.success("Rodapé salvo com sucesso!")
        } catch (error: any) {
            toast.error(`Erro ao salvar rodapé: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
            <input type="hidden" name="id" value={settings.id} />
            <SectionHeader icon={FileText} title="Rodapé do Site" />

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="footer_about_text">Texto &quot;Sobre Nós&quot; (abaixo do logo)</Label>
                    <Textarea
                        id="footer_about_text"
                        name="footer_about_text"
                        className="min-h-[80px] rounded-xl"
                        placeholder="Ex: Peças exclusivas com qualidade premium. Fazemos moda que conta histórias."
                        defaultValue={settings.footer_about_text || 'Peças exclusivas com qualidade premium. Fazemos moda que conta histórias.'}
                    />
                    <p className="text-xs text-zinc-400">Esse texto aparece no rodapé, abaixo do nome da loja.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="footer_newsletter_title">Título da Newsletter</Label>
                        <Input
                            id="footer_newsletter_title"
                            name="footer_newsletter_title"
                            placeholder="Ex: Fique por dentro"
                            defaultValue={settings.footer_newsletter_title || 'Fique por dentro'}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="footer_newsletter_subtitle">Subtítulo da Newsletter</Label>
                        <Input
                            id="footer_newsletter_subtitle"
                            name="footer_newsletter_subtitle"
                            placeholder="Ex: Receba novidades e ofertas exclusivas."
                            defaultValue={settings.footer_newsletter_subtitle || 'Receba novidades e ofertas exclusivas.'}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Rodapé" />
        </form>
    )
}
