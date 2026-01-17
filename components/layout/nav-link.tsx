'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavLinkProps {
    href: string
    icon?: LucideIcon
    label: string
    alert?: boolean
    className?: string
}

export function NavLink({ href, icon: Icon, label, alert, className }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

    return (
        <Link
            href={href}
            className={cn(
                // Base styles - clean, no visible box
                'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                // Default state
                'text-foreground/70',
                // Hover state - creates the "box on hover" effect
                'hover:bg-accent hover:text-accent-foreground',
                // Active state - keeps the box if you're on that page
                isActive && 'bg-secondary text-secondary-foreground',
                // Alert state - red text but NOT full box
                alert && !isActive && 'text-red-500 hover:text-red-600',
                className
            )}
        >
            {Icon && (
                <span className="relative">
                    <Icon className="h-4 w-4" />
                    {/* Red Alert Dot */}
                    {alert && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </span>
            )}
            <span>{label}</span>
        </Link>
    )
}

// Mobile variant with larger touch targets
export function MobileNavLink({ href, icon: Icon, label, alert, onClick, className }: NavLinkProps & { onClick?: () => void }) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                // Base styles
                'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                // Default state
                'text-foreground',
                // Hover state
                'hover:bg-muted',
                // Active state
                isActive && 'bg-secondary text-secondary-foreground',
                // Alert state
                alert && !isActive && 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30',
                className
            )}
        >
            {Icon && (
                <span className="relative">
                    <Icon className={cn('h-5 w-5', alert ? 'text-red-500' : 'text-muted-foreground')} />
                    {alert && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" />
                    )}
                </span>
            )}
            <span>{label}</span>
        </Link>
    )
}
