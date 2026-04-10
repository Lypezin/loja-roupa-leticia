type LoaderParams = {
    src: string
    width: number
    quality?: number
}

const SUPABASE_PUBLIC_PREFIX = '/storage/v1/object/public/'
const SUPABASE_RENDER_PREFIX = '/storage/v1/render/image/public/'

export default function supabaseImageLoader({ src, width, quality }: LoaderParams) {
    if (!src || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('/')) {
        return src
    }

    try {
        const url = new URL(src)

        if (url.pathname.startsWith(SUPABASE_PUBLIC_PREFIX)) {
            url.pathname = url.pathname.replace(SUPABASE_PUBLIC_PREFIX, SUPABASE_RENDER_PREFIX)
            url.searchParams.set('width', String(width))
            url.searchParams.set('quality', String(quality ?? 80))
            return url.toString()
        }
    } catch {
        return src
    }

    return src
}
