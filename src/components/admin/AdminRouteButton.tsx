'use client'

import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'

type AdminRouteButtonProps = ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        href: string
        pendingContent?: ReactNode
    }

export function AdminRouteButton({
    href,
    children,
    pendingContent,
    disabled,
    onClick,
    ...props
}: AdminRouteButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)

        if (event.defaultPrevented) {
            return
        }

        startTransition(() => {
            router.push(href)
        })
    }

    return (
        <Button
            {...props}
            type="button"
            onClick={handleClick}
            disabled={disabled || isPending}
            aria-busy={isPending}
        >
            {isPending ? (
                pendingContent ?? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando...
                    </>
                )
            ) : children}
        </Button>
    )
}
