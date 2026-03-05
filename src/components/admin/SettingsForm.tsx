'use client'

import { ProfileSection } from "./settings/ProfileSection"
import { BannerSection } from "./settings/BannerSection"
import { ContentSection } from "./settings/ContentSection"
import { FooterSection } from "./settings/FooterSection"
import { LogisticsSection } from "./settings/LogisticsSection"

interface SettingsFormProps {
    settings: any
}

export function SettingsForm({ settings }: SettingsFormProps) {
    if (!settings) {
        return <p className="text-zinc-500">Erro: Nenhuma configuração encontrada no banco.</p>
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <ProfileSection settings={settings} />
            <BannerSection settings={settings} />
            <ContentSection settings={settings} />
            <FooterSection settings={settings} />
            <LogisticsSection settings={settings} />
        </div>
    )
}
