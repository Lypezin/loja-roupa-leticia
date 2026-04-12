import { getServiceFilter } from "./config"
import { melhorEnvioRequest } from "./client"
import { normalizePositiveNumber } from "./utils"
import type { 
    CalculateQuotesArgs, 
    MelhorEnvioQuoteResponseItem, 
    ShippingQuoteOption 
} from "./types"

export async function calculateMelhorEnvioShippingQuotes({
    originPostalCode,
    destinationPostalCode,
    subtotal,
    freeShippingThreshold,
    processingDays,
    items,
    storeName,
    supportEmail,
}: CalculateQuotesArgs): Promise<ShippingQuoteOption[]> {
    const services = getServiceFilter()

    const payload = {
        from: {
            postal_code: originPostalCode.replace(/\D/g, ""),
        },
        to: {
            postal_code: destinationPostalCode.replace(/\D/g, ""),
        },
        products: items.map((item) => ({
            id: `${item.product_id}:${item.variation_id}`,
            width: item.width_cm,
            height: item.height_cm,
            length: item.length_cm,
            weight: item.weight_kg,
            insurance_value: Number(item.unit_price.toFixed(2)),
            quantity: item.quantity,
        })),
        options: {
            receipt: false,
            own_hand: false,
        },
        ...(services ? { services } : {}),
    }

    const response = await melhorEnvioRequest<MelhorEnvioQuoteResponseItem[]>(
        "/api/v2/me/shipment/calculate",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        {
            storeName,
            supportEmail,
        },
    )

    const normalizedProcessingDays = Math.max(0, processingDays ?? 0)

    const options = response
        .filter((service) => !service.error)
        .map((service) => {
            const providerPrice = normalizePositiveNumber(service.custom_price)
                ?? normalizePositiveNumber(service.price)
            const providerDeliveryDays = normalizePositiveNumber(service.custom_delivery_time)
                ?? normalizePositiveNumber(service.delivery_time)
            const serviceId = service.id == null ? null : String(service.id)
            const serviceName = typeof service.name === "string" ? service.name.trim() : ""

            if (!providerPrice || !providerDeliveryDays || !serviceId || !serviceName) {
                return null
            }

            const companyName = service.company && typeof service.company.name === "string"
                ? service.company.name.trim()
                : "Transportadora"

            return {
                provider: "melhor_envio" as const,
                postal_code: destinationPostalCode,
                service_id: serviceId,
                service_name: serviceName,
                company_name: companyName,
                cost: Number(providerPrice.toFixed(2)),
                provider_cost: Number(providerPrice.toFixed(2)),
                delivery_days: Math.ceil(providerDeliveryDays + normalizedProcessingDays),
                processing_days: normalizedProcessingDays,
                is_free_shipping: false,
                quote_payload: service as Record<string, unknown>,
            }
        })
        .filter((service): service is ShippingQuoteOption => Boolean(service))
        .sort((a, b) => a.cost - b.cost || a.delivery_days - b.delivery_days)

    if (options.length === 0) {
        throw new Error("Nenhuma opção de frete disponível para esse CEP.")
    }

    if (freeShippingThreshold !== null && subtotal >= freeShippingThreshold) {
        const [cheapestOption] = options

        return [{
            ...cheapestOption,
            cost: 0,
            is_free_shipping: true,
        }]
    }

    return options
}
