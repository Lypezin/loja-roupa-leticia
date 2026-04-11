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
    settings: Record<string, string | number | null>
    melhorEnvio: MelhorEnvioIntegrationStatus
    shippingCoverage: ShippingCoverageSummary
}

export function SettingsForm({ settings, melhorEnvio, shippingCoverage }: SettingsFormProps) {
    const [activeTab, setActiveTab] = useState("perfil")

    if (!settings) {
        return <p className="text-sm text-muted-foreground">Nenhuma configuração encontrada.</p>
    }

    const tabs = [
        { id: "perfil", label: "Perfil e SEO", icon: User },
        { id: "banner", label: "Banner hero", icon: ImageIcon },
        { id: "conteudo", label: "Página inicial", icon: Type },
        { id: "rodape", label: "Rodapé", icon: LayoutTemplate },
        { id: "logistica", label: "Logística", icon: Truck },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case "perfil":
                return <ProfileSection settings={settings} />
            case "banner":
                return <BannerSection settings={settings} />
            case "conteudo":
                return <ContentSection settings={settings} />
            case "rodape":
                return <FooterSection settings={settings} />
            case "logistica":
                return <LogisticsSection settings={settings} melhorEnvio={melhorEnvio} shippingCoverage={shippingCoverage} />
            default:
                return <ProfileSection settings={settings} />
        }
    }

    return (
        <div className="flex flex-col items-start gap-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
            <aside className="w-full rounded-xl border border-border bg-card p-3 lg:sticky lg:top-6">
                <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Seções
                </p>
                <nav className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide lg:flex-col lg:overflow-x-visible lg:pb-0">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="font-medium">{tab.label}</span>
                                {isActive ? <ChevronRight className="ml-auto hidden h-3.5 w-3.5 opacity-70 lg:block" /> : null}
                            </button>
                        )
                    })}
                </nav>
            </aside>

            <main className="w-full">
                <div key={activeTab} className="min-h-[24rem]">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
