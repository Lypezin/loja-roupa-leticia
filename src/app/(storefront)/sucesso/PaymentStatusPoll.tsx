'use client'

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

type PaymentStatusPollProps = {
    enabled: boolean
    maxRefreshes?: number
}

export function PaymentStatusPoll({ enabled, maxRefreshes = 15 }: PaymentStatusPollProps) {
    const router = useRouter()
    const refreshCount = useRef(0)

    useEffect(() => {
        refreshCount.current = 0
    }, [enabled])

    useEffect(() => {
        if (!enabled) {
            return
        }

        const intervalId = window.setInterval(() => {
            refreshCount.current += 1

            if (refreshCount.current > maxRefreshes) {
                window.clearInterval(intervalId)
                return
            }

            router.refresh()
        }, 4000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [enabled, maxRefreshes, router])

    return null
}
