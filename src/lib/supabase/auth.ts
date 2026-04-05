import type { User } from '@supabase/supabase-js'

function normalizeEmail(email: string) {
    return email.trim().toLowerCase()
}

function getConfiguredAdminEmails() {
    const configured = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .flatMap((value) => value.split(','))
        .map(normalizeEmail)

    return new Set(configured)
}

export function isAdminUser(user: Pick<User, 'email' | 'app_metadata'> | null | undefined) {
    if (!user) {
        return false
    }

    const appRole = user.app_metadata?.role
    if (typeof appRole === 'string' && appRole === 'admin') {
        return true
    }

    const appRoles = user.app_metadata?.roles
    if (Array.isArray(appRoles) && appRoles.includes('admin')) {
        return true
    }

    if (typeof user.email !== 'string' || user.email.length === 0) {
        return false
    }

    return getConfiguredAdminEmails().has(normalizeEmail(user.email))
}
