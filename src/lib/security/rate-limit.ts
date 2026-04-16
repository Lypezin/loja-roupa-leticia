import "server-only"
import { createHash } from "node:crypto"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import type { RequestSecurityContext } from "./request-context"

type RateLimitIdentifier =
    | { type: "ip" | "email" | "user"; value: string | null | undefined }
    | null
    | undefined

type RateLimitOptions = {
    scope: string
    maxAttempts: number
    windowSeconds: number
    blockSeconds?: number
    identifiers: RateLimitIdentifier[]
}

type RateLimitResult = {
    allowed: boolean
    retry_after_seconds: number | null
    remaining: number | null
    reset_at: string | null
}

export class RateLimitError extends Error {
    retryAfterSeconds: number

    constructor(message: string, retryAfterSeconds: number) {
        super(message)
        this.name = "RateLimitError"
        this.retryAfterSeconds = retryAfterSeconds
    }
}

function normalizeIdentifierValue(identifier: RateLimitIdentifier) {
    if (!identifier?.value) {
        return null
    }

    const normalizedValue = identifier.value.trim().toLowerCase()
    return normalizedValue ? `${identifier.type}:${normalizedValue}` : null
}

function hashIdentifier(value: string) {
    return createHash("sha256").update(value, "utf8").digest("hex")
}

function formatRetryMessage(scope: string, retryAfterSeconds: number) {
    if (scope.includes("login")) {
        return `Muitas tentativas de login. Aguarde ${retryAfterSeconds}s e tente novamente.`
    }

    if (scope.includes("signup") || scope.includes("cadastro")) {
        return `Muitas tentativas de cadastro. Aguarde ${retryAfterSeconds}s e tente novamente.`
    }

    if (scope.includes("checkout")) {
        return `Muitas tentativas de checkout. Aguarde ${retryAfterSeconds}s e tente novamente.`
    }

    return `Limite de requisições atingido. Aguarde ${retryAfterSeconds}s e tente novamente.`
}

async function consumeRateLimit(scope: string, identifierHash: string, maxAttempts: number, windowSeconds: number, blockSeconds?: number) {
    const supabase = createServiceRoleClient(`rate-limit.${scope}`)

    const { data, error } = await (supabase as unknown as {
        rpc: (
            fn: string,
            params: Record<string, unknown>,
        ) => Promise<{ data: RateLimitResult[] | null; error: { message: string } | null }>
    }).rpc("consume_rate_limit", {
        p_scope: scope,
        p_identifier_hash: identifierHash,
        p_max_attempts: maxAttempts,
        p_window_seconds: windowSeconds,
        p_block_seconds: blockSeconds ?? windowSeconds,
    })

    if (error) {
        throw new Error(`Falha ao validar rate limit: ${error.message}`)
    }

    return data?.[0] ?? null
}

export async function enforceRateLimit(options: RateLimitOptions) {
    const identifiers = options.identifiers
        .map(normalizeIdentifierValue)
        .filter((value): value is string => Boolean(value))

    const uniqueIdentifiers = [...new Set(identifiers)]

    for (const identifier of uniqueIdentifiers) {
        const result = await consumeRateLimit(
            options.scope,
            hashIdentifier(identifier),
            options.maxAttempts,
            options.windowSeconds,
            options.blockSeconds,
        )

        if (!result?.allowed) {
            const retryAfterSeconds = Math.max(result?.retry_after_seconds ?? options.windowSeconds, 1)
            throw new RateLimitError(formatRetryMessage(options.scope, retryAfterSeconds), retryAfterSeconds)
        }
    }
}

export function buildIpAndUserIdentifiers(
    context: RequestSecurityContext,
    userId?: string | null,
    email?: string | null,
): RateLimitIdentifier[] {
    return [
        { type: "ip", value: context.ip },
        userId ? { type: "user", value: userId } : null,
        email ? { type: "email", value: email } : null,
    ]
}
