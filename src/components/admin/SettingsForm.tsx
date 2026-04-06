'use client'

import { useState } from "react"
import { ProfileSection } from "./settings/ProfileSection"
import { BannerSection } from "./settings/BannerSection"
import { ContentSection } from "./settings/ContentSection"
import { FooterSection } from "./settings/FooterSection"
import { LogisticsSection } from "./settings/LogisticsSection"
import { User, Image as ImageIcon, Type, LayoutTemplate, Truck, ChevronRight } from "lucide-react"

interface SettingsFormProps {
    settings: Record<string, string | null>
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const [activeTab, setActiveTab] = useState("perfil")

    if (!settings) {
        return <p className="text-sm text-muted-foreground">Nenhuma configuracao encontrada.</p>
    }

    const tabs = [
        { id: "perfil", label: "Perfil e SEO", icon: User, desc: "identidade e busca" },
        { id: "banner", label: "Banner hero", icon: ImageIcon, desc: "destaque principal" },
        { id: "conteudo", label: "Pagina inicial", icon: Type, desc: "titulos e secoes" },
        { id: "rodape", label: "Rodape", icon: LayoutTemplate, desc: "links e newsletter" },
        { id: "logistica", label: "Logistica", icon: Truck, desc: "fretes e prazos" },
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
                return <LogisticsSection settings={settings} />
            default:
                return <ProfileSection settings={settings} />
        }
    }

    return (
        <div className="flex flex-col items-start gap-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            <aside className="paper-panel w-full rounded-[1.8rem] p-4 lg:sticky lg:top-8">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Ajustes principais
                </p>
                <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:flex-col lg:overflow-x-visible lg:pb-0">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group flex shrink-0 items-center gap-3 rounded-[1.4rem] px-4 py-3 text-left transition-all ${isActive
                                    ? "bg-foreground text-background shadow-[0_16px_30px_-22px_rgba(34,27,24,0.6)]"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${isActive
                                    ? "border-background/20 bg-background/10"
                                    : "border-border bg-background group-hover:border-border/70"
                                    }`}>
                                    <tab.icon className={`h-4 w-4 ${isActive ? "text-background" : "text-foreground/70"}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold tracking-tight">{tab.label}</p>
                                    <p className={`text-[10px] uppercase tracking-[0.18em] ${isActive ? "text-background/70" : "text-muted-foreground group-hover:text-foreground/65"}`}>
                                        {tab.desc}
                                    </p>
                                </div>
                                {isActive ? <ChevronRight className="hidden h-4 w-4 text-background/70 lg:block" /> : null}
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
