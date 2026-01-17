'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

export function SearchInput() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const debouncedSearch = useDebounce(searchTerm, 300)

    // Update URL when debounced search changes
    const updateSearchParams = useCallback(
        (term: string) => {
            const params = new URLSearchParams(searchParams.toString())

            if (term) {
                params.set('search', term)
            } else {
                params.delete('search')
            }

            // Use replace to prevent cluttering browser history
            router.replace(`${pathname}?${params.toString()}`)
        },
        [searchParams, pathname, router]
    )

    useEffect(() => {
        updateSearchParams(debouncedSearch)
    }, [debouncedSearch, updateSearchParams])

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-fresh w-full pl-10 py-3"
            />
        </div>
    )
}
