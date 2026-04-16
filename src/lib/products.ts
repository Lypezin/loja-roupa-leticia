const UUID_LIKE_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuidLike(value: string) {
    return UUID_LIKE_PATTERN.test(value)
}

export function getProductPath(slug: string) {
    return `/produto/${encodeURIComponent(slug)}`
}
