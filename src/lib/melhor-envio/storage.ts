import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { decryptMelhorEnvioToken, encryptMelhorEnvioToken } from "./token-crypto"
import type { MelhorEnvioEnvironment, MelhorEnvioIntegrationRow } from "./types"

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

    if (!data) {
        return data
    }

    return {
        ...data,
        access_token: decryptMelhorEnvioToken(data.access_token),
        refresh_token: decryptMelhorEnvioToken(data.refresh_token),
    }
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
            access_token: encryptMelhorEnvioToken(integration.access_token),
            refresh_token: encryptMelhorEnvioToken(integration.refresh_token),
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
