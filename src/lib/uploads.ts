export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
] as const
export const ACCEPTED_IMAGE_INPUT = ACCEPTED_IMAGE_MIME_TYPES.join(',')

type UploadFile = {
    size: number
    type: string
}

export function validateImageFile(file: UploadFile | null | undefined) {
    if (!file || file.size === 0) {
        return
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
        throw new Error('A imagem excede o limite de 5 MB.')
    }

    if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number])) {
        throw new Error('Formato de imagem invalido. Use JPG, PNG, WEBP, AVIF ou GIF.')
    }
}
