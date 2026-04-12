interface OrderShippingCardProps {
    companyName?: string | null
    serviceName?: string | null
    addressStr: string
}

export function OrderShippingCard({ companyName, serviceName, addressStr }: OrderShippingCardProps) {
    return (
        <div className="surface-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl text-foreground">Entrega</h2>
            {(companyName || serviceName) && (
                <p className="mt-4 text-sm font-medium text-foreground">
                    {[companyName, serviceName].filter(Boolean).join(" - ")}
                </p>
            )}
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{addressStr}</p>
        </div>
    )
}
