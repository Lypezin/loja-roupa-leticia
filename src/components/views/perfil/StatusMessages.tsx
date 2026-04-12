interface StatusMessagesProps {
    warningMessage?: string | null
    successMessage?: string | null
    errorMessage?: string | null
}

export function StatusMessages({ warningMessage, successMessage, errorMessage }: StatusMessagesProps) {
    return (
        <div className="space-y-4">
            {warningMessage && (
                <div className="rounded-[1.2rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {warningMessage}
                </div>
            )}

            {successMessage && (
                <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}
        </div>
    )
}
