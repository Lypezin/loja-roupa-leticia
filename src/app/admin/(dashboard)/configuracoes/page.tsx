import { SettingsForm } from "@/components/admin/SettingsForm"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ConfiguracoesPage() {
    const supabase = await createClient()

    const { data: settings } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .maybeSingle()

    return (
        <div className="flex w-full max-w-6xl flex-col gap-6">
            <div className="paper-panel rounded-[2rem] px-6 py-6 md:px-8">
                <span className="eyebrow">{"gest\u00e3o da marca"}</span>
                <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{"Configura\u00e7\u00f5es da loja"}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {"Ajuste identidade visual, destaque da home, contatos e log\u00edstica com um painel mais direto e organizado."}
                </p>
            </div>

            <SettingsForm settings={settings || {}} />
        </div>
    )
}
