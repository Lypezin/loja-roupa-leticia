import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/admin/SettingsForm"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ConfiguracoesPage() {
    const supabase = await createClient()

    // Resgata com limite 1 a única linha de config do DB
    const { data: settings } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações Gerais</h1>
                <p className="text-muted-foreground">
                    Gerencie o perfil da loja, integração de fretes e políticas de negócio.
                </p>
            </div>

            <SettingsForm settings={settings || {}} />
        </div>
    )
}
