import type { User } from '@supabase/supabase-js'

type AppMetadata = Pick<User, 'app_metadata'>['app_metadata']

function hasAdminRole(appMetadata: AppMetadata) {
    if (!appMetadata || typeof appMetadata !== 'object') {
        return false
    }

    const role = appMetadata.role
    if (typeof role === 'string' && role === 'admin') {
        return true
    }

    const roles = appMetadata.roles
    return Array.isArray(roles) && roles.includes('admin')
}

export function isAdminUser(user: Pick<User, 'app_metadata'> | null | undefined) {
    if (!user) {
        return false
    }

    return hasAdminRole(user.app_metadata)
}
