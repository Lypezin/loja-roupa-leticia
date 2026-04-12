export function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && error.message) {
        return error.message
    }
    return fallback
}

export function parsePositiveDecimal(value: FormDataEntryValue | null, label: string) {
    const parsedValue = Number.parseFloat(typeof value === "string" ? value.replace(",", ".") : "")

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
        throw new Error(`${label} inválido.`)
    }

    return parsedValue
}
