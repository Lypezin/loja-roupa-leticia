const LOCAL_DEV_SITE_URL = 'http://localhost:3000'

function normalizeSiteUrl(value: string) {
    let parsedUrl: URL

    try {
        parsedUrl = new URL(value)
    } catch {
        throw new Error('NEXT_PUBLIC_SITE_URL invalida.')
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('NEXT_PUBLIC_SITE_URL deve usar http ou https.')
    }

    parsedUrl.pathname = ''
    parsedUrl.search = ''
    parsedUrl.hash = ''

    return parsedUrl.toString().replace(/\/$/, '')
}

export function getSiteUrl() {
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

    if (configuredSiteUrl) {
        return normalizeSiteUrl(configuredSiteUrl)
    }

    if (process.env.NODE_ENV !== 'production') {
        return LOCAL_DEV_SITE_URL
    }

    throw new Error('NEXT_PUBLIC_SITE_URL ausente em producao.')
}
