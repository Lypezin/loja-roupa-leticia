'use client'

import { useState } from "react"
import { Headphones, RotateCcw, ShieldCheck, Sparkles, Truck, Type } from "lucide-react"
import { toast } from "sonner"
import { saveContent } from "@/app/admin/(dashboard)/configuracoes/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionHeader, SaveButton, showSuccess } from "./SettingsUI"

interface ContentSectionProps {
    settings: Record<string, string | number | null>
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
        } catch (error: unknown) {
            const err = error as Error
            toast.error(`Erro ao salvar conteúdo: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-10 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
            <input type="hidden" name="id" value={settings.id || ''} />

            <SectionHeader
                icon={Type}
                title="Página inicial"
                description="Controle os textos e legendas das seções principais da sua vitrine."
            />

            <div className="space-y-6">
                <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">Títulos de coleções e lançamentos</h3>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_label" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Categorias: legenda</Label>
                        <Input id="categories_section_label" name="categories_section_label" defaultValue={settings.categories_section_label || 'Coleções'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_title" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Categorias: título principal</Label>
                        <Input id="categories_section_title" name="categories_section_title" defaultValue={settings.categories_section_title || 'Explore por categoria'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_label" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Produtos: legenda</Label>
                        <Input id="products_section_label" name="products_section_label" defaultValue={settings.products_section_label || 'Novidades'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_title" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Produtos: título principal</Label>
                        <Input id="products_section_title" name="products_section_title" defaultValue={settings.products_section_title || 'Lançamentos'} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>
            </div>

            <div className="space-y-6 border-t border-zinc-50 pt-8">
                <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">Selos de confiança</h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <Truck className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Selo 1</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_1_title" placeholder="Título" defaultValue={settings.trust_banner_1_title || 'Envio rápido'} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_1_desc" placeholder="Descrição" defaultValue={settings.trust_banner_1_desc || 'Para todo o Brasil'} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <ShieldCheck className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Selo 2</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_2_title" placeholder="Título" defaultValue={settings.trust_banner_2_title || 'Compra segura'} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_2_desc" placeholder="Descrição" defaultValue={settings.trust_banner_2_desc || 'Pagamento protegido'} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <RotateCcw className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Selo 3</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_3_title" placeholder="Título" defaultValue={settings.trust_banner_3_title || 'Trocas fáceis'} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_3_desc" placeholder="Descrição" defaultValue={settings.trust_banner_3_desc || 'Em até 7 dias'} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <Headphones className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Selo 4</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_4_title" placeholder="Título" defaultValue={settings.trust_banner_4_title || 'Suporte'} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_4_desc" placeholder="Descrição" defaultValue={settings.trust_banner_4_desc || 'Atendimento humanizado'} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar Conteúdo" />
        </form>
    )
}
