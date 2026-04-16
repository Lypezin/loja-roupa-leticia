import "server-only"
import { headers } from "next/headers"

export type RequestSecurityContext = {
    ip: string | null
    userAgent: string | null
    host: string | null
    origin: string | null
}

function normalizeHeaderValue(value: string | null) {
    const trimmedValue = value?.trim()
    return trimmedValue ? trimmedValue : null
}

function readForwardedIp(value: string | null) {
    const normalizedValue = normalizeHeaderValue(value)
    if (!normalizedValue) {
        return null
    }

    const firstEntry = normalizedValue
        .split(",")
        .map((entry) => entry.trim())
        .find(Boolean)

    return firstEntry || null
}

export function getRequestSecurityContextFromHeaders(headerBag: Headers): RequestSecurityContext {
    return {
        ip:
            readForwardedIp(headerBag.get("cf-connecting-ip"))
            || readForwardedIp(headerBag.get("x-forwarded-for"))
            || normalizeHeaderValue(headerBag.get("x-real-ip")),
        userAgent: normalizeHeaderValue(headerBag.get("user-agent")),
        host: normalizeHeaderValue(headerBag.get("x-forwarded-host")) || normalizeHeaderValue(headerBag.get("host")),
        origin: normalizeHeaderValue(headerBag.get("origin")),
    }
}

export async function getServerActionSecurityContext() {
    const headerBag = await headers()
    return getRequestSecurityContextFromHeaders(headerBag)
}
