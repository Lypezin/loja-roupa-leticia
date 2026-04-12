const LOCAL_URL_ORIGIN = "https://local.store"

type RedirectInput = FormDataEntryValue | string | null | undefined

export function getSafeRelativePath(value: RedirectInput, fallback: string | null = null) {
    if (typeof value !== "string") {
        return fallback
    }

    const trimmedValue = value.trim()

    if (!trimmedValue || !trimmedValue.startsWith("/") || trimmedValue.startsWith("//") || trimmedValue.includes("\\")) {
        return fallback
    }

    try {
        const parsedUrl = new URL(trimmedValue, LOCAL_URL_ORIGIN)

        if (parsedUrl.origin !== LOCAL_URL_ORIGIN) {
            return fallback
        }

        return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
    } catch {
        return fallback
    }
}

export function getSafeAbsoluteUrl(
    value: string | null | undefined,
    allowedProtocols: string[] = ["https:", "http:"],
) {
    if (!value) {
        return null
    }

    try {
        const parsedUrl = new URL(value)
        return allowedProtocols.includes(parsedUrl.protocol) ? parsedUrl.toString() : null
    } catch {
        return null
    }
}
