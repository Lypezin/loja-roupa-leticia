export function readStringValue(value: string | number | null | undefined) {
    return typeof value === "string" ? value : ""
}

export function readThresholdValue(value: string | number | null | undefined) {
    if (typeof value === "number") {
        return value > 0 ? String(value) : ""
    }

    if (typeof value === "string") {
        const parsedValue = Number.parseFloat(value)
        return Number.isFinite(parsedValue) && parsedValue > 0 ? value : ""
    }

    return ""
}
