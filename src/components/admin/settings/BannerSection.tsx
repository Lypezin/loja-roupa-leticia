'use client'

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutTemplate, Upload } from "lucide-react"
import { saveBanner } from "@/app/admin/(dashboard)/configuracoes/actions"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface BannerSectionProps {
    settings: any
}

export function BannerSection({ settings }: BannerSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [bannerPreview, setBannerPreview] = useState<string | null>(settings?.hero_image_url || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setBannerPreview(url)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const imageFile = fileInputRef.current?.files?.[0]

            if (imageFile && imageFile.size > 0) {
                const supabase = createClient()
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `banner-${Date.now()}.${fileExt}`
                const filePath = `store-assets/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, imageFile)

                if (uploadError) {
                    throw new Error('Falha ao enviar imagem: ' + uploadError.message)
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                formData.set('hero_image_url_new', publicUrl)
            }

            const res = await saveBanner(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Banner salvo com sucesso!")
        } catch (error: any) {
            toast.error(`Erro ao salvar banner: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
            <input type="hidden" name="id" value={settings.id} />
            <SectionHeader icon={LayoutTemplate} title="Banner Principal (Vitrine)" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="hero_title">Título Principal</Label>
                    <Input id="hero_title" name="hero_title" placeholder="Ex: Nova Coleção Inverno" defaultValue={settings.hero_title || ''} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hero_subtitle">Subtítulo</Label>
                    <Input id="hero_subtitle" name="hero_subtitle" placeholder="Ex: Essenciais para dias frios." defaultValue={settings.hero_subtitle || ''} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hero_button_text">Texto do Botão</Label>
                    <Input id="hero_button_text" name="hero_button_text" placeholder="Ex: Comprar Agora" defaultValue={settings.hero_button_text || ''} className="rounded-xl" />
                </div>
            </div>

            <div className="space-y-3 mt-2">
                <Label>Imagem de Fundo</Label>
                {bannerPreview && (
                    <div className="relative w-full md:w-1/2 aspect-video rounded-xl overflow-hidden border border-zinc-100 group/preview">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/preview:scale-105"
                            style={{ backgroundImage: `url(${bannerPreview})` }}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                )}
                <div
                    className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center cursor-pointer hover:border-zinc-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">Clique para enviar uma imagem</p>
                    <p className="text-xs text-zinc-400 mt-1">Recomendado: 1920x1080px</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagePreview}
                />
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Banner" />
        </form>
    )
}
