'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
        return <p className="text-zinc-500">Erro: Nenhuma configuração encontrada no banco.</p>
    }

    const tabs = [
        { id: "perfil", label: "Perfil e SEO", icon: User, desc: "Identidade e busca" },
        { id: "banner", label: "Banner Hero", icon: ImageIcon, desc: "Destaque principal" },
        { id: "conteudo", label: "Página Inicial", icon: Type, desc: "Títulos e seções" },
        { id: "rodape", label: "Rodapé", icon: LayoutTemplate, desc: "Links e newsletter" },
        { id: "logistica", label: "Logística", icon: Truck, desc: "Fretes e prazos" },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case "perfil": return <ProfileSection settings={settings} />
            case "banner": return <BannerSection settings={settings} />
            case "conteudo": return <ContentSection settings={settings} />
            case "rodape": return <FooterSection settings={settings} />
            case "logistica": return <LogisticsSection settings={settings} />
            default: return <ProfileSection settings={settings} />
        }
    }

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Sidebar de Navegação */}
            <aside className="w-full lg:sticky lg:top-8 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 px-4 mb-2">Categorias de Ajuste</p>
                <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-4 lg:pb-0 scrollbar-hide">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-left shrink-0 group ${isActive
                                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                                    : "text-zinc-500 hover:bg-zinc-100"
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-white/10" : "bg-zinc-100 group-hover:bg-zinc-200"
                                    }`}>
                                    <tab.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold tracking-tight">{tab.label}</p>
                                    <p className={`text-[10px] ${isActive ? "text-zinc-400" : "text-zinc-400 group-hover:text-zinc-500"}`}>
                                        {tab.desc}
                                    </p>
                                </div>
                                {isActive && (
                                    <ChevronRight className="h-4 w-4 text-zinc-600 hidden lg:block" />
                                )}
                            </button>
                        )
                    })}
                </nav>
            </aside>

            {/* Área de Conteúdo */}
            <main className="w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
