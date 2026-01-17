'use client'

import { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: string
    alert?: boolean
    alertColor?: 'red' | 'amber' | 'emerald'
    iconBgColor?: string
    valueColor?: string
}

export function StatsCard({
    title,
    value,
    icon,
    trend,
    alert = false,
    alertColor = 'emerald',
    iconBgColor = 'bg-emerald-100 dark:bg-emerald-900/50',
    valueColor = 'text-foreground',
}: StatsCardProps) {
    // Determine colors based on alert state
    const borderClass = alert
        ? alertColor === 'red'
            ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20'
            : alertColor === 'amber'
                ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20'
                : ''
        : ''

    const displayValueColor = alert && alertColor === 'red' ? 'text-red-500' : valueColor

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className={cn(
                        'card-fresh dark:bg-slate-800 dark:border-slate-700 flex items-center gap-3 p-3 sm:p-4',
                        'cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 hover:shadow-lg',
                        borderClass
                    )}
                >
                    {/* Icon */}
                    <div className={cn('p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0', iconBgColor)}>
                        {icon}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
                        <p className={cn('text-base sm:text-xl font-bold truncate', displayValueColor)}>
                            {value}
                        </p>
                    </div>
                </div>
            </DialogTrigger>

            {/* Expanded Popup */}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-muted-foreground font-normal text-base">
                        <div className={cn('p-2 rounded-lg', iconBgColor)}>
                            {icon}
                        </div>
                        {title}
                    </DialogTitle>
                </DialogHeader>

                {/* Large Value Display */}
                <div className="py-6 text-center">
                    <p className={cn(
                        'text-4xl sm:text-5xl font-bold break-all',
                        alert && alertColor === 'red' ? 'text-red-500' : 'text-emerald-500'
                    )}>
                        {value}
                    </p>
                </div>

                {/* Trend/Description Footer */}
                {trend && (
                    <div className="text-center pb-2">
                        <p className="text-sm text-muted-foreground">{trend}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
