'use client'

import { useState } from "react"
import { ChevronRight, Image as ImageIcon, LayoutTemplate, Truck, Type, User } from "lucide-react"
import { BannerSection } from "./settings/BannerSection"
import { ContentSection } from "./settings/ContentSection"
import { FooterSection } from "./settings/FooterSection"
import { LogisticsSection } from "./settings/LogisticsSection"
import { ProfileSection } from "./settings/ProfileSection"
import type { MelhorEnvioIntegrationStatus, ShippingCoverageSummary } from "@/types/shipping"

interface SettingsFormProps {
    settings: Record<string, string | number | boolean | null>
    melhorEnvio: MelhorEnvioIntegrationStatus
    shippingCoverage: ShippingCoverageSummary
}

export function SettingsForm({ settings, melhorEnvio, shippingCoverage }: SettingsFormProps) {
    const [activeTab, setActiveTab] = useState("perfil")
    const baseSettings = settings as Record<string, string | number | null>

    if (!settings) {
        return <p className="text-sm text-muted-foreground">Nenhuma configuração encontrada.</p>
    }

    const tabs = [
        { id: "perfil", label: "Perfil e SEO", description: "Nome, contatos e apresentação da loja.", icon: User },
        { id: "banner", label: "Banner hero", description: "Imagem principal e chamadas da primeira dobra.", icon: ImageIcon },
        { id: "conteudo", label: "Página inicial", description: "Textos da home e blocos de confiança.", icon: Type },
        { id: "rodape", label: "Rodapé", description: "Informações institucionais da loja.", icon: LayoutTemplate },
        { id: "logistica", label: "Logística", description: "Melhor Envio, despacho e frete grátis.", icon: Truck },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case "perfil":
                return <ProfileSection settings={baseSettings} />
            case "banner":
                return <BannerSection settings={baseSettings} />
            case "conteudo":
                return <ContentSection settings={baseSettings} />
            case "rodape":
                return <FooterSection settings={baseSettings} />
            case "logistica":
                return <LogisticsSection settings={settings} melhorEnvio={melhorEnvio} shippingCoverage={shippingCoverage} />
            default:
                return <ProfileSection settings={baseSettings} />
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
            <aside className="xl:sticky xl:top-8 xl:self-start">
                <div className="rounded-[1.8rem] border border-zinc-200/80 bg-white/92 p-3 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-4">
                    <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/70 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Áreas de configuração
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Cada seção controla uma parte específica da experiência da loja.
                        </p>
                    </div>

                    <nav className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-col">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group flex min-w-0 cursor-pointer items-start gap-3 rounded-[1.15rem] border px-3.5 py-3 text-left transition-all md:px-4 ${
                                        isActive
                                            ? "border-zinc-200 bg-zinc-950 text-white shadow-[0_18px_35px_rgba(70,48,34,0.14)]"
                                            : "border-transparent bg-transparent text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950"
                                    }`}
                                >
                                    <span
                                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border md:h-10 md:w-10 ${
                                            isActive ? "border-white/15 bg-white/10 text-white" : "border-zinc-200 bg-white text-zinc-600"
                                        }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-semibold">{tab.label}</span>
                                        <span className={`mt-1 block text-xs leading-5 ${
                                            isActive ? "text-white/70" : "text-zinc-500"
                                        }`}>
                                            {tab.description}
                                        </span>
                                    </span>
                                    {isActive ? <ChevronRight className="mt-1 hidden h-4 w-4 xl:block" /> : null}
                                </button>
                            )
                        })}
                    </nav>
                </div>
            </aside>

            <main className="min-w-0">
                <div key={activeTab} className="min-h-[24rem]">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
