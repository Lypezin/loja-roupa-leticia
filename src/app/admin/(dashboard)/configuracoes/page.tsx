import { SettingsForm } from "@/components/admin/SettingsForm"
import { getMelhorEnvioIntegrationStatus } from "@/lib/melhor-envio"
import { createClient } from "@/lib/supabase/server"
import type { ShippingCoverageSummary } from "@/types/shipping"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ConfiguracoesPage() {
    const supabase = await createClient()

    const [{ data: settings }, melhorEnvio, { data: products }] = await Promise.all([
        supabase
            .from("store_settings")
            .select("*")
            .limit(1)
            .maybeSingle(),
        getMelhorEnvioIntegrationStatus(),
        supabase
            .from("products")
            .select("id, weight_kg, height_cm, width_cm, length_cm"),
    ])

    const shippingCoverage: ShippingCoverageSummary = (products || []).reduce<ShippingCoverageSummary>((summary, product) => {
        const isReadyForShipping = Boolean(
            product.weight_kg
            && product.height_cm
            && product.width_cm
            && product.length_cm,
        )

        return {
            totalProducts: summary.totalProducts + 1,
            productsReadyForShipping: summary.productsReadyForShipping + (isReadyForShipping ? 1 : 0),
            productsMissingShippingData: summary.productsMissingShippingData + (isReadyForShipping ? 0 : 1),
        }
    }, {
        totalProducts: 0,
        productsReadyForShipping: 0,
        productsMissingShippingData: 0,
    })

    return (
        <div className="flex w-full max-w-6xl flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configurações</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Identidade visual, banner, contatos e logística da loja.
                </p>
            </div>

            <SettingsForm
                settings={settings || {}}
                melhorEnvio={melhorEnvio}
                shippingCoverage={shippingCoverage}
            />
        </div>
    )
}
