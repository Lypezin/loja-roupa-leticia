'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Type, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react"
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
            toast.success("Conteúdo e selos de confiança salvos!")
        } catch (error: any) {
            toast.error(`Erro ao salvar: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-2xl border border-zinc-100 space-y-8 shadow-sm">
            <input type="hidden" name="id" value={settings.id} />
            <SectionHeader icon={Type} title="Seções e Selos de Confiança" />

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Títulos das Seções</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_label">Categorias: Legenda</Label>
                        <Input id="categories_section_label" name="categories_section_label" defaultValue={settings.categories_section_label || 'Coleções'} className="rounded-xl border-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_title">Categorias: Título</Label>
                        <Input id="categories_section_title" name="categories_section_title" defaultValue={settings.categories_section_title || 'Explore por Categoria'} className="rounded-xl border-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_label">Produtos: Legenda</Label>
                        <Input id="products_section_label" name="products_section_label" defaultValue={settings.products_section_label || 'Novidades'} className="rounded-xl border-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_title">Produtos: Título</Label>
                        <Input id="products_section_title" name="products_section_title" defaultValue={settings.products_section_title || 'Lançamentos'} className="rounded-xl border-zinc-200" />
                    </div>
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-50">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Selos de Confiança (Trust Banner)</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Item 1 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-100">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-zinc-100 shrink-0 shadow-sm">
                            <Truck className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Título do Selo 1</Label>
                                <Input name="trust_banner_1_title" defaultValue={settings.trust_banner_1_title || 'Envio Rápido'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Descrição</Label>
                                <Input name="trust_banner_1_desc" defaultValue={settings.trust_banner_1_desc || 'Para todo o Brasil'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-100">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-zinc-100 shrink-0 shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Título do Selo 2</Label>
                                <Input name="trust_banner_2_title" defaultValue={settings.trust_banner_2_title || 'Compra Segura'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Descrição</Label>
                                <Input name="trust_banner_2_desc" defaultValue={settings.trust_banner_2_desc || 'Pagamento protegido'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-100">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-zinc-100 shrink-0 shadow-sm">
                            <RotateCcw className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Título do Selo 3</Label>
                                <Input name="trust_banner_3_title" defaultValue={settings.trust_banner_3_title || 'Trocas Fáceis'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Descrição</Label>
                                <Input name="trust_banner_3_desc" defaultValue={settings.trust_banner_3_desc || 'Em até 7 dias'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-100">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-zinc-100 shrink-0 shadow-sm">
                            <Headphones className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Título do Selo 4</Label>
                                <Input name="trust_banner_4_title" defaultValue={settings.trust_banner_4_title || 'Suporte'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] lowercase font-bold text-zinc-500">Descrição</Label>
                                <Input name="trust_banner_4_desc" defaultValue={settings.trust_banner_4_desc || 'Atendimento humanizado'} className="h-9 text-sm rounded-lg bg-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Todas as Seções" />
        </form>
    )
}
