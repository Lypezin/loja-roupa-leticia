export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
] as const
export const ACCEPTED_IMAGE_INPUT = ACCEPTED_IMAGE_MIME_TYPES.join(",")

type ImageSignature = {
    mime: (typeof ACCEPTED_IMAGE_MIME_TYPES)[number]
    extension: "jpg" | "png" | "webp" | "avif" | "gif"
    bytes: number[]
    offset?: number
    extraBytes?: number[]
    extraOffset?: number
}

const IMAGE_SIGNATURES: ImageSignature[] = [
    { mime: "image/jpeg", extension: "jpg", bytes: [0xff, 0xd8, 0xff] },
    { mime: "image/png", extension: "png", bytes: [0x89, 0x50, 0x4e, 0x47] },
    { mime: "image/webp", extension: "webp", bytes: [0x52, 0x49, 0x46, 0x46], extraBytes: [0x57, 0x45, 0x42, 0x50], extraOffset: 8 },
    { mime: "image/gif", extension: "gif", bytes: [0x47, 0x49, 0x46, 0x38] },
    { mime: "image/avif", extension: "avif", bytes: [0x66, 0x74, 0x79, 0x70], offset: 4, extraBytes: [0x61, 0x76, 0x69, 0x66], extraOffset: 8 },
]

type UploadFile = {
    size: number
    type: string
    name?: string
    arrayBuffer?: () => Promise<ArrayBuffer>
}

function matchesSignature(buffer: Uint8Array, signature: ImageSignature) {
    const offset = signature.offset ?? 0

    if (buffer.length < offset + signature.bytes.length) {
        return false
    }

    const primaryMatch = signature.bytes.every((byte, index) => buffer[offset + index] === byte)
    if (!primaryMatch) {
        return false
    }

    if (!signature.extraBytes || signature.extraOffset === undefined) {
        return true
    }

    if (buffer.length < signature.extraOffset + signature.extraBytes.length) {
        return false
    }

    return signature.extraBytes.every((byte, index) => buffer[signature.extraOffset! + index] === byte)
}

function getMimeExtension(mimeType: string) {
    return IMAGE_SIGNATURES.find((signature) => signature.mime === mimeType)?.extension ?? null
}

async function validateImageSignature(file: UploadFile) {
    if (typeof file.arrayBuffer !== "function") {
        return
    }

    const buffer = new Uint8Array(await file.arrayBuffer())
    const matchingSignature = IMAGE_SIGNATURES.find((signature) => matchesSignature(buffer, signature))

    if (!matchingSignature) {
        throw new Error("A imagem enviada nao possui uma assinatura de arquivo valida.")
    }

    if (matchingSignature.mime !== file.type) {
        throw new Error("O tipo real da imagem nao corresponde ao formato informado.")
    }
}

export async function validateImageFile(file: UploadFile | null | undefined) {
    if (!file || file.size === 0) {
        return null
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
        throw new Error("A imagem excede o limite de 5 MB.")
    }

    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number])) {
        throw new Error("Formato de imagem invalido. Use JPG, PNG, WEBP, AVIF ou GIF.")
    }

    const mimeExtension = getMimeExtension(file.type)

    if (file.name && mimeExtension) {
        const normalizedName = file.name.trim().toLowerCase()

        if (!normalizedName.endsWith(`.${mimeExtension}`) && !(mimeExtension === "jpg" && normalizedName.endsWith(".jpeg"))) {
            throw new Error("A extensao do arquivo nao corresponde ao tipo da imagem.")
        }
    }

    await validateImageSignature(file)

    return {
        extension: mimeExtension,
        mimeType: file.type,
    }
}
