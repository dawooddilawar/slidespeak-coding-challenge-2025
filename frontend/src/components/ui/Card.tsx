'use client'

import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
    children: ReactNode
    className?: string
}

export function Card({ children, className }: CardProps) {
    return (
        <div
            className={cn(
                'w-[416px] h-[276px] bg-white rounded-xl shadow-sm',
                className
            )}
        >
            {children}
        </div>
    )
}