import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader"
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
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                eyebrow="Marca e operação"
                title="Configurações mais organizadas."
                description="Ajuste identidade, textos, hero, rodapé e logística em uma estrutura única. A ideia aqui é diminuir dispersão e deixar claro o impacto de cada bloco na vitrine."
                metrics={[
                    { label: "Melhor Envio", value: melhorEnvio.connected ? "Conectado" : "Pendente", description: `Ambiente atual: ${melhorEnvio.environment === "production" ? "produção" : "sandbox"}.` },
                    { label: "Produtos prontos para frete", value: `${shippingCoverage.productsReadyForShipping}/${shippingCoverage.totalProducts}`, description: "Itens com peso e dimensões completas." },
                    { label: "Origem de despacho", value: typeof settings?.shipping_origin_zip === "string" && settings.shipping_origin_zip ? settings.shipping_origin_zip : "Pendente", description: "CEP usado nas cotações." },
                ]}
            />

            <SettingsForm
                settings={settings || {}}
                melhorEnvio={melhorEnvio}
                shippingCoverage={shippingCoverage}
            />
        </div>
    )
}
