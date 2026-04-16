import { createHmac, timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { applyMelhorEnvioWebhook } from "@/lib/melhor-envio"
import { getMelhorEnvioWebhookSigningSecrets } from "@/lib/melhor-envio/config"
import { buildIpAndUserIdentifiers, enforceRateLimit, RateLimitError } from "@/lib/security/rate-limit"
import { getRequestSecurityContextFromHeaders } from "@/lib/security/request-context"

export const runtime = "nodejs"

function verifySignature(rawBody: string, signature: string) {
    const receivedBuffer = Buffer.from(signature.trim())

    return getMelhorEnvioWebhookSigningSecrets().some((secret) => {
        const expected = createHmac("sha256", secret)
            .update(rawBody)
            .digest("base64")

        const expectedBuffer = Buffer.from(expected)

        if (expectedBuffer.length !== receivedBuffer.length) {
            return false
        }

        return timingSafeEqual(expectedBuffer, receivedBuffer)
    })
}

export async function POST(request: Request) {
    const rawBody = await request.text()
    const signature = request.headers.get("x-me-signature")
    const securityContext = getRequestSecurityContextFromHeaders(request.headers)

    try {
        await enforceRateLimit({
            scope: "webhook:melhor-envio",
            maxAttempts: 120,
            windowSeconds: 60,
            blockSeconds: 60 * 2,
            identifiers: buildIpAndUserIdentifiers(securityContext),
        })
    } catch (error) {
        if (error instanceof RateLimitError) {
            return NextResponse.json({ error: "too_many_requests" }, { status: 429 })
        }

        throw error
    }

    if (!signature) {
        return NextResponse.json({ error: "missing_signature" }, { status: 400 })
    }

    if (!verifySignature(rawBody, signature)) {
        return NextResponse.json({ error: "invalid_signature" }, { status: 401 })
    }

    try {
        const payload = JSON.parse(rawBody)
        const orderId = await applyMelhorEnvioWebhook(payload)

        return NextResponse.json({
            received: true,
            orderId,
        })
    } catch (error) {
        console.error("Erro ao processar webhook do Melhor Envio:", error)
        return NextResponse.json({ error: "webhook_processing_error" }, { status: 500 })
    }
}
