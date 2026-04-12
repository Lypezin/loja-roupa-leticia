'use client'

import { useState } from "react"
import { Heading, Headphones, RotateCcw, ShieldCheck, Truck, Type } from "lucide-react"
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
            if (res?.error) {
                throw new Error(res.error)
            }
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
        <form action={handleSubmit} className="space-y-10 rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-8">
            <input type="hidden" name="id" value={settings.id || ""} />

            <SectionHeader
                icon={Type}
                title="Página inicial"
                description="Controle os textos e legendas das seções principais da sua vitrine."
            />

            <div className="space-y-6">
                <div className="mb-4 flex items-center gap-2">
                    <Heading className="h-4 w-4 text-zinc-500" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">Títulos da home</h3>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_label" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Categorias: legenda</Label>
                        <Input id="categories_section_label" name="categories_section_label" defaultValue={String(settings.categories_section_label || "Categorias")} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categories_section_title" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Categorias: título</Label>
                        <Input id="categories_section_title" name="categories_section_title" defaultValue={String(settings.categories_section_title || "Escolha por tipo de peça")} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_label" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Produtos: legenda</Label>
                        <Input id="products_section_label" name="products_section_label" defaultValue={String(settings.products_section_label || "Novidades")} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="products_section_title" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Produtos: título</Label>
                        <Input id="products_section_title" name="products_section_title" defaultValue={String(settings.products_section_title || "Peças que acabaram de chegar")} className="h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-200" />
                    </div>
                </div>
            </div>

            <div className="space-y-6 border-t border-zinc-50 pt-8">
                <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">Blocos de confiança</h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <Truck className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bloco 1</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_1_title" placeholder="Título" defaultValue={String(settings.trust_banner_1_title || "Entrega com rastreio")} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_1_desc" placeholder="Descrição" defaultValue={String(settings.trust_banner_1_desc || "Consulte o prazo e valor antes de pagar.")} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <ShieldCheck className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bloco 2</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_2_title" placeholder="Título" defaultValue={String(settings.trust_banner_2_title || "Pagamento protegido")} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_2_desc" placeholder="Descrição" defaultValue={String(settings.trust_banner_2_desc || "Checkout seguro para Pix e cartão.")} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <RotateCcw className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bloco 3</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_3_title" placeholder="Título" defaultValue={String(settings.trust_banner_3_title || "Troca em até 7 dias")} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_3_desc" placeholder="Descrição" defaultValue={String(settings.trust_banner_3_desc || "Suporte direto por WhatsApp ou e-mail.")} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-colors hover:border-zinc-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <Headphones className="h-4 w-4 text-zinc-500" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bloco 4</span>
                        </div>
                        <div className="grid gap-3">
                            <Input name="trust_banner_4_title" placeholder="Título" defaultValue={String(settings.trust_banner_4_title || "Atendimento direto")} className="h-10 rounded-xl bg-white text-sm" />
                            <Input name="trust_banner_4_desc" placeholder="Descrição" defaultValue={String(settings.trust_banner_4_desc || "Resposta em horário comercial.")} className="h-10 rounded-xl bg-white text-sm" />
                        </div>
                    </div>
                </div>
            </div>

            <SaveButton isLoading={isLoading} success={success} label="Salvar conteúdo" />
        </form>
    )
}
