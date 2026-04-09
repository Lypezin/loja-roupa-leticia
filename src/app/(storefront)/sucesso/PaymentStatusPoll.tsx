'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type PaymentStatusPollProps = {
    enabled: boolean
}

export function PaymentStatusPoll({ enabled }: PaymentStatusPollProps) {
    const router = useRouter()

    useEffect(() => {
        if (!enabled) {
            return
        }

        const intervalId = window.setInterval(() => {
            router.refresh()
        }, 4000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [enabled, router])

    return null
}
