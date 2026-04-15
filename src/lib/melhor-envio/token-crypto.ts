import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto"

const ENCRYPTED_PREFIX = "enc:v1:"
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

function getEncryptionKey() {
    const secret = process.env.MELHOR_ENVIO_TOKEN_ENCRYPTION_KEY?.trim()
    if (!secret) {
        return null
    }

    return createHash("sha256").update(secret, "utf8").digest()
}

export function hasMelhorEnvioTokenEncryptionKey() {
    return Boolean(getEncryptionKey())
}

export function isEncryptedMelhorEnvioToken(token: string) {
    return token.trim().startsWith(ENCRYPTED_PREFIX)
}

export function encryptMelhorEnvioToken(token: string) {
    const cleanToken = token.trim()
    const key = getEncryptionKey()

    if (!cleanToken || !key || cleanToken.startsWith(ENCRYPTED_PREFIX)) {
        return cleanToken
    }

    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv("aes-256-gcm", key, iv)
    const encrypted = Buffer.concat([cipher.update(cleanToken, "utf8"), cipher.final()])
    const authTag = cipher.getAuthTag()

    return `${ENCRYPTED_PREFIX}${Buffer.concat([iv, authTag, encrypted]).toString("base64url")}`
}

export function decryptMelhorEnvioToken(token: string) {
    const cleanToken = token.trim()
    const key = getEncryptionKey()

    if (!cleanToken.startsWith(ENCRYPTED_PREFIX) || !key) {
        return cleanToken
    }

    const payload = Buffer.from(cleanToken.slice(ENCRYPTED_PREFIX.length), "base64url")
    const iv = payload.subarray(0, IV_LENGTH)
    const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
    const encrypted = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH)
    const decipher = createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")
}
