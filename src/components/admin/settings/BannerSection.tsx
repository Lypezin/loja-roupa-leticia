'use client'

import { useState } from "react"
import Image from "next/image"
import { CloudUpload, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { ACCEPTED_IMAGE_INPUT } from "@/lib/uploads"
import { saveBanner } from "@/app/admin/(dashboard)/configuracoes/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface BannerSectionProps {
    settings: Record<string, string | null>
}

export function BannerSection({ settings }: BannerSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(settings.hero_image_url || null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await saveBanner(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Banner hero atualizado!")
        } catch (error: unknown) {
            const err = error as Error
            toast.error(`Erro ao salvar banner: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
            <input type="hidden" name="id" value={settings.id || ''} />

            <SectionHeader
                icon={ImageIcon}
                title="Banner hero"
                description="Ocupa a primeira dobra da loja. Use imagens de alta qualidade e chamadas impactantes."
            />

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="hero_badge_text" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Badge / etiqueta</Label>
                        <Input id="hero_badge_text" name="hero_badge_text" defaultValue={settings.hero_badge_text || 'Nova Coleção 2025'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hero_title" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Título principal</Label>
                        <Input id="hero_title" name="hero_title" defaultValue={settings.hero_title || ''} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hero_subtitle" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Subtítulo</Label>
                        <Input id="hero_subtitle" name="hero_subtitle" defaultValue={settings.hero_subtitle || ''} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hero_button_text" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Botão principal</Label>
                        <Input id="hero_button_text" name="hero_button_text" defaultValue={settings.hero_button_text || ''} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hero_secondary_button_text" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Botão secundário</Label>
                        <Input id="hero_secondary_button_text" name="hero_secondary_button_text" defaultValue={settings.hero_secondary_button_text || 'Conheça a marca'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>

                    <div className="space-y-2 border-t border-zinc-50 pt-4 md:col-span-2">
                        <Label htmlFor="countdown_end" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Término da oferta (cronômetro)</Label>
                        <Input
                            id="countdown_end"
                            name="countdown_end"
                            type="datetime-local"
                            defaultValue={settings.countdown_end ? new Date(settings.countdown_end).toISOString().slice(0, 16) : ''}
                            className="h-11 w-full rounded-xl border-zinc-200 focus-visible:ring-zinc-200 md:w-1/2"
                        />
                        <p className="text-[10px] text-zinc-400">Deixe vazio para desativar o cronômetro na página inicial.</p>
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Imagem de fundo</Label>
                    <div className="group relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-zinc-300">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Background Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-zinc-900 shadow-xl">
                                        <CloudUpload className="h-4 w-4" /> Alterar fundo
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                                    <ImageIcon className="h-6 w-6 text-zinc-400" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-600">Upload de imagem de fundo</p>
                                <p className="text-xs text-zinc-400">Recomendado: 1920x1080px (alta resolução)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            name="hero_image"
                            accept={ACCEPTED_IMAGE_INPUT}
                            onChange={handleImageChange}
                            className="absolute inset-0 cursor-pointer opacity-0"
                        />
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Banner Hero" />
        </form>
    )
}
