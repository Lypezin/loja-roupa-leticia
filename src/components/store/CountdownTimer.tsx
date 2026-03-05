'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
    targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = new Date(targetDate).getTime() - now

            if (distance < 0) {
                clearInterval(timer)
                setIsExpired(true)
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    if (isExpired) return null

    return (
        <div className="flex gap-4 mt-8">
            {[
                { label: 'DIAS', value: timeLeft.days },
                { label: 'HORAS', value: timeLeft.hours },
                { label: 'MIN', value: timeLeft.minutes },
                { label: 'SEG', value: timeLeft.seconds }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <span className="text-xl md:text-2xl font-bold text-white tabular-nums">
                            {String(item.value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-white/60 mt-2 tracking-widest">{item.label}</span>
                </div>
            ))}
        </div>
    )
}
