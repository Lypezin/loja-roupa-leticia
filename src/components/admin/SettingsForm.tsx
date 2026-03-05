'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveSettings } from "@/app/admin/(dashboard)/configuracoes/actions"
import { Store, Truck, Mail, Phone, Instagram, LayoutTemplate } from "lucide-react"

interface SettingsFormProps {
    settings: any
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            await saveSettings(formData)
            alert("Configurações atualizadas com sucesso!")
        } catch (error) {
            console.error("Erro ao salvar:", error)
            alert("Falha ao atualizar configurações.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!settings) {
        return <p className="text-zinc-500">Erro: Nenhuma configuração encontrada no banco.</p>
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-3xl" encType="multipart/form-data">
            {/* ID invisível */}
            <input type="hidden" name="id" value={settings.id} />

            {/* CAIXA 1: PERFIL DA LOJA */}
            <div className="bg-white p-6 rounded-xl border space-y-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b pb-4">
                    <Store className="w-5 h-5 text-zinc-500" />
                    <h2 className="text-xl font-semibold">Perfil e SEO</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="store_name">Nome da Loja</Label>
                        <Input id="store_name" name="store_name" defaultValue={settings.store_name} required />
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
            </div>

            {/* CAIXA 2: VITRINE E BANNER PRINCIPAL */}
            <div className="bg-white p-6 rounded-xl border space-y-6 shadow-sm">
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
                    <Label htmlFor="hero_image">Imagem de Fundo do Banner</Label>
                    <input type="hidden" name="current_hero_image_url" value={settings.hero_image_url || ''} />

                    {settings.hero_image_url && (
                        <div className="relative w-full md:w-1/2 aspect-video rounded-md overflow-hidden border mb-2">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${settings.hero_image_url})` }}
                            />
                        </div>
                    )}

                    <Input id="hero_image" name="hero_image" type="file" accept="image/*" />
                    <p className="text-xs text-zinc-500">Formato recomendado: Paisagem (1920x1080px). Um gradiente escuro é aplicado automaticamente para os textos ficarem legíveis.</p>
                </div>
            </div>

            {/* CAIXA 3: LOGÍSTICA E FRETE */}
            <div className="bg-white p-6 rounded-xl border space-y-6 shadow-sm">
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
                    * Esses dados serão vitais na Fase 4 e 5 para calcularmos as etiquetas através da API de Entrega (Ex: Melhor Envio).
                </p>
            </div>

            <Button disabled={isLoading} type="submit" className="w-full md:w-auto px-8 bg-zinc-950 text-white cursor-pointer h-12">
                {isLoading ? "Salvando Alterações..." : "Salvar Configurações"}
            </Button>
        </form>
    )
}
