import type { Json } from "@/lib/supabase/database.types"
import { getMelhorEnvioEnvironment } from "../config"
import { getStoredIntegration, persistIntegration } from "../storage"
import { fetchMelhorEnvioAccountProfile } from "./client"
import type { MelhorEnvioIntegrationStatus } from "../types"

export async function getMelhorEnvioIntegrationStatus(
    environment = getMelhorEnvioEnvironment(),
): Promise<MelhorEnvioIntegrationStatus> {
    let integration = await getStoredIntegration(environment)

    if (integration?.access_token && (!integration.account_email || !integration.account_name)) {
        const profile = await fetchMelhorEnvioAccountProfile(integration.access_token, environment)

        if (profile.email || profile.name || profile.raw) {
            await persistIntegration({
                environment,
                access_token: integration.access_token,
                refresh_token: integration.refresh_token,
                expires_at: integration.expires_at,
                token_type: integration.token_type,
                scope: integration.scope,
                account_email: profile.email || integration.account_email,
                account_name: profile.name || integration.account_name,
                metadata: integration.metadata && Object.keys(integration.metadata).length > 0
                    ? integration.metadata
                    : (profile.raw || {}) as Json,
            })

            integration = await getStoredIntegration(environment)
        }
    }

    return {
        connected: Boolean(integration?.refresh_token),
        environment,
        expires_at: integration?.expires_at || null,
        connected_at: integration?.created_at || null,
        account_email: integration?.account_email || null,
        account_name: integration?.account_name || null,
    }
}
