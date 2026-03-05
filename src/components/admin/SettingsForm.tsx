'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveProfile, saveBanner, saveLogistics, saveFooter } from "@/app/admin/(dashboard)/configuracoes/actions"
import { createClient } from "@/lib/supabase/client"
import { Store, Truck, Phone, Instagram, LayoutTemplate, Loader2, CheckCircle2, Upload, FileText } from "lucide-react"

interface SettingsFormProps {
    settings: any
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [isLoadingBanner, setIsLoadingBanner] = useState(false)
    const [isLoadingLogistics, setIsLoadingLogistics] = useState(false)
    const [isLoadingFooter, setIsLoadingFooter] = useState(false)

    const [successProfile, setSuccessProfile] = useState(false)
    const [successBanner, setSuccessBanner] = useState(false)
    const [successLogistics, setSuccessLogistics] = useState(false)
    const [successFooter, setSuccessFooter] = useState(false)

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

    const handleFooterSubmit = async (formData: FormData) => {
        setIsLoadingFooter(true)
        try {
            const res = await saveFooter(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccessFooter)
        } catch (error: any) {
            alert(`Erro ao salvar rodapé: ${error.message}`)
        } finally {
            setIsLoadingFooter(false)
        }
    }

    const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setBannerPreview(url)
        }
    }

    // Seção Header + Save Button reusável
    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
            <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center">
                <Icon className="w-4 h-4 text-zinc-600" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        </div>
    )

    const SaveButton = ({ isLoading, success, label }: { isLoading: boolean, success: boolean, label: string }) => (
        <div className="pt-4 border-t border-zinc-100 mt-6 flex justify-end items-center gap-3">
            {success && (
                <span className="text-sm text-emerald-600 flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso!
                </span>
            )}
            <Button disabled={isLoading} type="submit" className="px-6 bg-zinc-950 text-white cursor-pointer h-10 rounded-xl hover:bg-zinc-800 transition-colors">
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                    </span>
                ) : label}
            </Button>
        </div>
    )

    return (
        <div className="space-y-6 max-w-3xl">

            {/* PERFIL DA LOJA */}
            <form action={handleProfileSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
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

                <SaveButton isLoading={isLoadingProfile} success={successProfile} label="Salvar Perfil" />
            </form>

            {/* BANNER PRINCIPAL */}
            <form action={handleBannerSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
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

                <SaveButton isLoading={isLoadingBanner} success={successBanner} label="Salvar Banner" />
            </form>

            {/* RODAPÉ DO SITE */}
            <form action={handleFooterSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
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

                <SaveButton isLoading={isLoadingFooter} success={successFooter} label="Salvar Rodapé" />
            </form>

            {/* LOGÍSTICA E FRETE */}
            <form action={handleLogisticsSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-5 shadow-sm">
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

                <SaveButton isLoading={isLoadingLogistics} success={successLogistics} label="Salvar Logística" />
            </form>

        </div>
    )
}
