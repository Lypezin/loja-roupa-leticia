export const ORDER_STATUS_VALUES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number]

export function isOrderStatus(value: string): value is OrderStatus {
    return ORDER_STATUS_VALUES.includes(value as OrderStatus)
}
