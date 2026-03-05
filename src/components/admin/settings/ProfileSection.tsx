'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Instagram, Mail, Phone, Search } from "lucide-react"
import { saveProfile } from "@/app/admin/(dashboard)/configuracoes/actions"
import { toast } from "sonner"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface ProfileSectionProps {
    settings: Record<string, string | null>
}

export function ProfileSection({ settings }: ProfileSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await saveProfile(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Perfil da loja atualizado!")
        } catch (error: unknown) {
            const err = error as Error
            toast.error(`Erro ao salvar perfil: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-8">
            <input type="hidden" name="id" value={settings.id || ''} />

            <SectionHeader
                icon={User}
                title="Perfil e SEO"
                description="Configure as informações fundamentais que aparecem no cabeçalho, rodapé e nos resultados de busca."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                    <Label htmlFor="store_name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Nome da Loja</Label>
                    <Input id="store_name" name="store_name" defaultValue={settings.store_name || ''} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="support_email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email de Suporte</Label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input id="support_email" name="support_email" type="email" defaultValue={settings.support_email || ''} className="pl-10 h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="whatsapp_number" className="text-xs font-bold uppercase tracking-wider text-zinc-400">WhatsApp</Label>
                    <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input id="whatsapp_number" name="whatsapp_number" defaultValue={settings.whatsapp_number || ''} className="pl-10 h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="instagram_url" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Instagram URL</Label>
                    <div className="relative">
                        <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input id="instagram_url" name="instagram_url" placeholder="https://instagram.com/..." defaultValue={settings.instagram_url || ''} className="pl-10 h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="store_description" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Descrição/SEO (Meta Description)</Label>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                        <Textarea
                            id="store_description"
                            name="store_description"
                            defaultValue={settings.store_description || ''}
                            rows={3}
                            className="pl-10 rounded-xl border-zinc-200 focus-visible:ring-zinc-200 resize-none pt-3"
                        />
                    </div>
                    <p className="text-[10px] text-zinc-400">Esta descrição aparece nos resultados de busca do Google.</p>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Perfil" />
        </form>
    )
}
