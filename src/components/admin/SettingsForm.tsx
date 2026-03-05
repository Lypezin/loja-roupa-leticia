'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveProfile, saveBanner, saveLogistics } from "@/app/admin/(dashboard)/configuracoes/actions"
import { createClient } from "@/lib/supabase/client"
import { Store, Truck, Phone, Instagram, LayoutTemplate, Loader2, CheckCircle2, Upload } from "lucide-react"

interface SettingsFormProps {
    settings: any
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [isLoadingBanner, setIsLoadingBanner] = useState(false)
    const [isLoadingLogistics, setIsLoadingLogistics] = useState(false)

    const [successProfile, setSuccessProfile] = useState(false)
    const [successBanner, setSuccessBanner] = useState(false)
    const [successLogistics, setSuccessLogistics] = useState(false)

    const [bannerPreview, setBannerPreview] = useState<string | null>(settings?.hero_image_url || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!settings) {
        return <p className="text-zinc-500">Erro: Nenhuma configuração encontrada no banco.</p>
    }

    const showSuccess = (setter: (v: boolean) => void) => {
        setter(true)
        setTimeout(() => setter(false), 3000)
    }

    const handleProfileSubmit = async (formData: FormData) => {
        setIsLoadingProfile(true)
        try {
            const res = await saveProfile(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccessProfile)
        } catch (error: any) {
            alert(`Erro ao salvar perfil: ${error.message}`)
        } finally {
            setIsLoadingProfile(false)
        }
    }

    const handleBannerSubmit = async (formData: FormData) => {
        setIsLoadingBanner(true)
        try {
            // Upload da imagem do lado do CLIENTE (browser) para evitar o limite de 1MB do Next.js Server Actions
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

                // Adiciona a URL ao FormData em vez do arquivo binário
                formData.set('hero_image_url_new', publicUrl)
            }

            const res = await saveBanner(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccessBanner)
        } catch (error: any) {
            alert(`Erro ao salvar banner: ${error.message}`)
        } finally {
            setIsLoadingBanner(false)
        }
    }

    const handleLogisticsSubmit = async (formData: FormData) => {
        setIsLoadingLogistics(true)
        try {
            const res = await saveLogistics(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccessLogistics)
        } catch (error: any) {
            alert(`Erro ao salvar logística: ${error.message}`)
        } finally {
            setIsLoadingLogistics(false)
        }
    }

    const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setBannerPreview(url)
        }
    }

    return (
        <div className="space-y-8 max-w-3xl">

            {/* CAIXA 1: PERFIL DA LOJA */}
            <form action={handleProfileSubmit} className="bg-white p-6 rounded-xl border space-y-6 shadow-sm transition-all hover:shadow-md">
                <input type="hidden" name="id" value={settings.id} />
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                    <Store className="w-5 h-5 text-zinc-500" />
                    <h2 className="text-xl font-semibold">Perfil e SEO</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="store_name">Nome da Loja</Label>
                        <Input id="store_name" name="store_name" defaultValue={settings.store_name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="support_email">E-mail de Suporte</Label>
                        <Input id="support_email" name="support_email" type="email" defaultValue={settings.support_email || ''} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="whatsapp_number">WhatsApp (Atendimento)</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input id="whatsapp_number" name="whatsapp_number" className="pl-9" placeholder="Ex: 11999999999" defaultValue={settings.whatsapp_number || ''} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instagram_url">Link do Instagram</Label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input id="instagram_url" name="instagram_url" className="pl-9" placeholder="https://instagram.com/sua_loja" defaultValue={settings.instagram_url || ''} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mt-4">
                    <Label htmlFor="store_description">Descrição (SEO e Compartilhamento WhatsApp)</Label>
                    <Textarea
                        id="store_description"
                        name="store_description"
                        className="min-h-[100px]"
                        placeholder="Ex: A melhor loja de moda premium minimalista. Frete para todo o Brasil."
                        defaultValue={settings.store_description || ''}
                    />
                </div>

                <div className="pt-2 border-t mt-4 flex justify-end items-center gap-3">
                    {successProfile && (
                        <span className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" /> Salvo!
                        </span>
                    )}
                    <Button disabled={isLoadingProfile} type="submit" className="px-6 bg-zinc-950 text-white cursor-pointer h-10 w-full md:w-auto">
                        {isLoadingProfile ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                            </span>
                        ) : "Salvar Perfil"}
                    </Button>
                </div>
            </form>

            {/* CAIXA 2: VITRINE E BANNER PRINCIPAL */}
            <form action={handleBannerSubmit} className="bg-white p-6 rounded-xl border space-y-6 shadow-sm transition-all hover:shadow-md">
                <input type="hidden" name="id" value={settings.id} />
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                    <LayoutTemplate className="w-5 h-5 text-zinc-500" />
                    <h2 className="text-xl font-semibold">Banner Principal (Vitrine)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="hero_title">Título Principal</Label>
                        <Input id="hero_title" name="hero_title" placeholder="Ex: Nova Coleção Inverno" defaultValue={settings.hero_title || ''} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hero_subtitle">Subtítulo</Label>
                        <Input id="hero_subtitle" name="hero_subtitle" placeholder="Ex: Essenciais para dias frios." defaultValue={settings.hero_subtitle || ''} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hero_button_text">Texto do Botão</Label>
                        <Input id="hero_button_text" name="hero_button_text" placeholder="Ex: Comprar Agora" defaultValue={settings.hero_button_text || ''} />
                    </div>
                </div>

                <div className="space-y-3 mt-4">
                    <Label>Imagem de Fundo do Banner</Label>

                    {bannerPreview && (
                        <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden border mb-2 group/preview">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/preview:scale-105"
                                style={{ backgroundImage: `url(${bannerPreview})` }}
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    )}

                    <div
                        className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                        <p className="text-sm text-zinc-500">Clique aqui para enviar uma imagem</p>
                        <p className="text-xs text-zinc-400 mt-1">Recomendado: Paisagem (1920x1080px)</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImagePreview}
                    />
                </div>

                <div className="pt-2 border-t mt-4 flex justify-end items-center gap-3">
                    {successBanner && (
                        <span className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" /> Salvo!
                        </span>
                    )}
                    <Button disabled={isLoadingBanner} type="submit" className="px-6 bg-zinc-950 text-white cursor-pointer h-10 w-full md:w-auto">
                        {isLoadingBanner ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Enviando Imagem...
                            </span>
                        ) : "Salvar Banner"}
                    </Button>
                </div>
            </form>

            {/* CAIXA 3: LOGÍSTICA E FRETE */}
            <form action={handleLogisticsSubmit} className="bg-white p-6 rounded-xl border space-y-6 shadow-sm transition-all hover:shadow-md">
                <input type="hidden" name="id" value={settings.id} />
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                    <Truck className="w-5 h-5 text-zinc-500" />
                    <h2 className="text-xl font-semibold">Logística e Frete (Carrinho)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="shipping_origin_zip">CEP de Origem</Label>
                        <Input
                            id="shipping_origin_zip"
                            name="shipping_origin_zip"
                            placeholder="Apenas números. Ex: 01001000"
                            defaultValue={settings.shipping_origin_zip || ''}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="free_shipping_threshold">Frete Grátis Acima de (R$)</Label>
                        <Input
                            id="free_shipping_threshold"
                            name="free_shipping_threshold"
                            type="number"
                            step="0.01"
                            placeholder="Deixe em branco para desativar"
                            defaultValue={settings.free_shipping_threshold || ''}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="processing_days">Tempo de Preparação (Dias úteis)</Label>
                        <Input
                            id="processing_days"
                            name="processing_days"
                            type="number"
                            min="0"
                            defaultValue={settings.processing_days ?? 2}
                        />
                    </div>
                </div>
                <p className="text-xs text-zinc-500 pt-2">
                    * Esses dados serão utilizados para calcular as etiquetas de frete (Ex: Melhor Envio).
                </p>

                <div className="pt-2 border-t mt-4 flex justify-end items-center gap-3">
                    {successLogistics && (
                        <span className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" /> Salvo!
                        </span>
                    )}
                    <Button disabled={isLoadingLogistics} type="submit" className="px-6 bg-zinc-950 text-white cursor-pointer h-10 w-full md:w-auto">
                        {isLoadingLogistics ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                            </span>
                        ) : "Salvar Logística"}
                    </Button>
                </div>
            </form>

        </div>
    )
}
