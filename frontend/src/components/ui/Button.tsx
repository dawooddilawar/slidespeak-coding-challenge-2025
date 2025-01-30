'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'custom'
    children: ReactNode
    customStyles?: {
        backgroundColor?: string
        textColor?: string
        padding?: string
        width?: string
    }
}

export function Button({
    variant = 'primary',
    children,
    className,
    disabled,
    customStyles,
    ...props
}: ButtonProps) {
    const getBaseStyles = () => {
        if (variant === 'custom' && customStyles) {
            return {
                backgroundColor: customStyles.backgroundColor,
                color: customStyles.textColor,
                padding: customStyles.padding,
                width: customStyles.width,
            }
        }
        return {}
    }

    return (
        <button
            className={cn(
                'font-semibold rounded-lg transition-colors text-sm text-[14px]',
                {
                    'h-10 px-4 py-2.5 flex items-center justify-center': variant !== 'custom',
                    'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700': variant === 'primary',
                    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': variant === 'secondary',
                    'opacity-50 cursor-not-allowed': disabled
                },
                className
            )}
            style={getBaseStyles()}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}