'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Type, ShieldCheck, Truck, RotateCcw, Headphones, Sparkles } from "lucide-react"
import { saveContent } from "@/app/admin/(dashboard)/configuracoes/actions"
import { toast } from "sonner"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface ContentSectionProps {
    settings: any
}

export function ContentSection({ settings }: ContentSectionProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const res = await saveContent(formData)
            if (res?.error) throw new Error(res.error)
            showSuccess(setSuccess)
            toast.success("Conteúdo da vitrine atualizado!")
        } catch (error: any) {
            toast.error(`Erro ao salvar conteúdo: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-10">
            <input type="hidden" name="id" value={settings.id} />

            <SectionHeader
                icon={Type}
                title="Página Inicial"
                description="Controle os textos e legendas das seções principais da sua vitrine."
            />

            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.2em]">Títulos de Coleções & Lançamentos</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_label" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Categorias: Legenda</Label>
                        <Input id="categories_section_label" name="categories_section_label" defaultValue={settings.categories_section_label || 'Coleções'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_title" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Categorias: Título Principal</Label>
                        <Input id="categories_section_title" name="categories_section_title" defaultValue={settings.categories_section_title || 'Explore por Categoria'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_label" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Produtos: Legenda</Label>
                        <Input id="products_section_label" name="products_section_label" defaultValue={settings.products_section_label || 'Novidades'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_title" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Produtos: Título Principal</Label>
                        <Input id="products_section_title" name="products_section_title" defaultValue={settings.products_section_title || 'Lançamentos'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-zinc-50">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-[0.2em]">Selos de Confiança (Trust Banner)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item 1 */}
                    <div className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100 space-y-4 hover:border-zinc-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                                <Truck className="w-4 h-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Selo 1</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_1_title" placeholder="Título" defaultValue={settings.trust_banner_1_title || 'Envio Rápido'} className="h-10 text-sm rounded-xl bg-white" />
                            <Input name="trust_banner_1_desc" placeholder="Descrição" defaultValue={settings.trust_banner_1_desc || 'Para todo o Brasil'} className="h-10 text-sm rounded-xl bg-white" />
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100 space-y-4 hover:border-zinc-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Selo 2</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_2_title" placeholder="Título" defaultValue={settings.trust_banner_2_title || 'Compra Segura'} className="h-10 text-sm rounded-xl bg-white" />
                            <Input name="trust_banner_2_desc" placeholder="Descrição" defaultValue={settings.trust_banner_2_desc || 'Pagamento protegido'} className="h-10 text-sm rounded-xl bg-white" />
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100 space-y-4 hover:border-zinc-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                                <RotateCcw className="w-4 h-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Selo 3</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_3_title" placeholder="Título" defaultValue={settings.trust_banner_3_title || 'Trocas Fáceis'} className="h-10 text-sm rounded-xl bg-white" />
                            <Input name="trust_banner_3_desc" placeholder="Descrição" defaultValue={settings.trust_banner_3_desc || 'Em até 7 dias'} className="h-10 text-sm rounded-xl bg-white" />
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100 space-y-4 hover:border-zinc-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                                <Headphones className="w-4 h-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Selo 4</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_4_title" placeholder="Título" defaultValue={settings.trust_banner_4_title || 'Suporte'} className="h-10 text-sm rounded-xl bg-white" />
                            <Input name="trust_banner_4_desc" placeholder="Descrição" defaultValue={settings.trust_banner_4_desc || 'Atendimento humanizado'} className="h-10 text-sm rounded-xl bg-white" />
                        </div>
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Conteúdo" />
        </form>
    )
}
