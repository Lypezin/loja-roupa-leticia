interface OrderShippingCardProps {
    companyName?: string | null
    serviceName?: string | null
    addressStr: string
    trackingCode?: string | null
    trackingUrl?: string | null
    labelUrl?: string | null
    statusDetail?: string | null
}

export function OrderShippingCard({ companyName, serviceName, addressStr, trackingCode, trackingUrl, labelUrl, statusDetail }: OrderShippingCardProps) {
    return (
        <div className="surface-card rounded-[1.8rem] p-6">
            <h2 className="font-display text-3xl text-foreground">Entrega</h2>
            {(companyName || serviceName) && (
                <p className="mt-4 text-sm font-medium text-foreground">
                    {[companyName, serviceName].filter(Boolean).join(" - ")}
                </p>
            )}
            {statusDetail && (
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Status do envio: {statusDetail}
                </p>
            )}
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{addressStr}</p>
            {(trackingCode || trackingUrl || labelUrl) && (
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {trackingCode && <p>Rastreio: {trackingCode}</p>}
                    {trackingUrl && (
                        <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                            Acompanhar envio
                        </a>
                    )}
                    {labelUrl && (
                        <a href={labelUrl} target="_blank" rel="noopener noreferrer" className="block font-medium text-primary hover:underline">
                            Abrir etiqueta
                        </a>
                    )}
                </div>
            )}
        </div>
    )
}
