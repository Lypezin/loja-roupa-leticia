import type { User } from '@supabase/supabase-js'

type UnknownRecord = Record<string, unknown>

export type ShippingAddress = {
    street: string
    number: string
    neighborhood: string
    line1: string
    line2: string | null
    city: string
    state: string
    postal_code: string
    country: string
}

export type CustomerProfile = {
    fullName: string
    email: string
    phone: string
    cpf: string
    shippingAddress: ShippingAddress | null
}

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === 'object' && value !== null
}

function readString(metadata: UnknownRecord, key: string) {
    const value = metadata[key]
    return typeof value === 'string' ? value.trim() : ''
}

function digitsOnly(value: string) {
    return value.replace(/\D/g, '')
}

export function normalizeBrazilState(value: string) {
    const normalized = value.trim().toUpperCase()

    if (!/^[A-Z]{2}$/.test(normalized)) {
        return null
    }

    return normalized
}

export function normalizeCpf(value: string) {
    const digits = digitsOnly(value)

    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
        return null
    }

    let sum = 0
    for (let index = 0; index < 9; index += 1) {
        sum += Number(digits[index]) * (10 - index)
    }

    let remainder = (sum * 10) % 11
    if (remainder === 10) {
        remainder = 0
    }

    if (remainder !== Number(digits[9])) {
        return null
    }

    sum = 0
    for (let index = 0; index < 10; index += 1) {
        sum += Number(digits[index]) * (11 - index)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10) {
        remainder = 0
    }

    if (remainder !== Number(digits[10])) {
        return null
    }

    return digits
}

export function normalizeBrazilPhone(value: string) {
    let digits = digitsOnly(value)

    if (digits.length === 10 || digits.length === 11) {
        digits = `55${digits}`
    }

    if (digits.length < 12 || digits.length > 13) {
        return null
    }

    return `+${digits}`
}

export function normalizePostalCode(value: string) {
    const digits = digitsOnly(value)

    if (digits.length !== 8) {
        return null
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function readCustomerProfile(user: User | null): CustomerProfile | null {
    if (!user || !user.email) {
        return null
    }

    const metadata = isRecord(user.user_metadata) ? user.user_metadata : {}
    const legacyLine1 = readString(metadata, 'address_line1')
    const legacyLine2 = readString(metadata, 'address_line2')
    const street = readString(metadata, 'address_street') || legacyLine1
    const number = readString(metadata, 'address_number')
    const neighborhood = readString(metadata, 'address_neighborhood')
    const complement = readString(metadata, 'address_complement') || legacyLine2
    const city = readString(metadata, 'city')
    const state = readString(metadata, 'state')
    const postalCode = readString(metadata, 'postal_code')
    const country = readString(metadata, 'country') || 'BR'

    const normalizedPostalCode = postalCode ? normalizePostalCode(postalCode) : null
    const normalizedState = state ? normalizeBrazilState(state) : null
    const line1 = street && number ? `${street}, ${number}` : street || legacyLine1
    const line2 = [neighborhood, complement].filter(Boolean).join(' - ') || legacyLine2 || null

    const shippingAddress = street && number && neighborhood && city && normalizedState && normalizedPostalCode
        ? {
            street,
            number,
            neighborhood,
            line1,
            line2,
            city,
            state: normalizedState,
            postal_code: normalizedPostalCode,
            country,
        }
        : null

    return {
        fullName: readString(metadata, 'full_name'),
        email: user.email,
        phone: readString(metadata, 'phone'),
        cpf: readString(metadata, 'cpf'),
        shippingAddress,
    }
}

export function getCheckoutProfile(user: User | null) {
    const profile = readCustomerProfile(user)

    if (!profile) {
        return { profile: null, missingFields: ['email'] }
    }

    const missingFields: string[] = []

    if (!profile.fullName) {
        missingFields.push('full_name')
    }

    if (!normalizeBrazilPhone(profile.phone)) {
        missingFields.push('phone')
    }

    if (!normalizeCpf(profile.cpf)) {
        missingFields.push('cpf')
    }

    if (!profile.shippingAddress) {
        missingFields.push('shipping_address')
    }

    return { profile, missingFields }
}
