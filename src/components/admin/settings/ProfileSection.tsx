'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Instagram, Store } from "lucide-react"
import { saveProfile } from "@/app/admin/(dashboard)/configuracoes/actions"
import { toast } from "sonner"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface ProfileSectionProps {
    settings: any
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
            toast.success("Perfil salvo com sucesso!")
        } catch (error: any) {
            toast.error(`Erro ao salvar perfil: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
            <input type="hidden" name="id" value={settings.id} />
            <SectionHeader icon={Store} title="Perfil e SEO" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="store_name">Nome da Loja</Label>
                    <Input id="store_name" name="store_name" defaultValue={settings.store_name} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="support_email">E-mail de Suporte</Label>
                    <Input id="support_email" name="support_email" type="email" defaultValue={settings.support_email || ''} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                        <Input id="whatsapp_number" name="whatsapp_number" className="pl-9 rounded-xl" placeholder="Ex: 11999999999" defaultValue={settings.whatsapp_number || ''} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="instagram_url">Instagram</Label>
                    <div className="relative">
                        <Instagram className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                        <Input id="instagram_url" name="instagram_url" className="pl-9 rounded-xl" placeholder="https://instagram.com/sua_loja" defaultValue={settings.instagram_url || ''} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="store_description">Descrição (SEO)</Label>
                <Textarea
                    id="store_description"
                    name="store_description"
                    className="min-h-[80px] rounded-xl"
                    placeholder="Descrição da loja para SEO e compartilhamento."
                    defaultValue={settings.store_description || ''}
                />
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Perfil" />
        </form>
    )
}
