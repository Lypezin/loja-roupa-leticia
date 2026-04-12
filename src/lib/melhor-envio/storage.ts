import { createServiceRoleClient } from "@/lib/supabase/service-role"
import type { MelhorEnvioIntegrationRow, MelhorEnvioEnvironment } from "./types"

export async function getStoredIntegration(environment: MelhorEnvioEnvironment) {
    const supabase = createServiceRoleClient("melhor-envio.get-integration")

    const { data, error } = await supabase
        .from("shipping_integrations")
        .select("*")
        .eq("provider", "melhor_envio")
        .eq("environment", environment)
        .maybeSingle()

    if (error) {
        throw new Error(`Falha ao carregar integração do Melhor Envio: ${error.message}`)
    }

    return data
}

export async function persistIntegration(
    integration: Pick<
        MelhorEnvioIntegrationRow,
        | "environment"
        | "access_token"
        | "refresh_token"
        | "expires_at"
        | "token_type"
        | "scope"
        | "account_email"
        | "account_name"
        | "metadata"
    >,
) {
    const supabase = createServiceRoleClient("melhor-envio.persist-integration")

    const { error } = await supabase
        .from("shipping_integrations")
        .upsert({
            provider: "melhor_envio",
            updated_at: new Date().toISOString(),
            ...integration,
        }, {
            onConflict: "provider,environment",
        })

    if (error) {
        throw new Error(`Falha ao salvar tokens do Melhor Envio: ${error.message}`)
    }
}

export async function disconnectMelhorEnvioIntegration(environment: MelhorEnvioEnvironment) {
    const supabase = createServiceRoleClient("melhor-envio.disconnect")

    const { error } = await supabase
        .from("shipping_integrations")
        .delete()
        .eq("provider", "melhor_envio")
        .eq("environment", environment)

    if (error) {
        throw new Error(`Falha ao desconectar o Melhor Envio: ${error.message}`)
    }
}
