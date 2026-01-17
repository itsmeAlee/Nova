'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition, useCallback } from 'react'

export function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams.get('search') || '')
    const [isPending, startTransition] = useTransition()

    // Sync state with URL if URL changes externally (e.g. Back button)
    useEffect(() => {
        setValue(searchParams.get('search') || '')
    }, [searchParams])

    const handleSearch = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }

        startTransition(() => {
            router.replace(`/shop?${params.toString()}`, { scroll: false })
        })
    }, [router, searchParams])

    // Debounce Effect for Auto-Type
    useEffect(() => {
        const currentUrlSearch = searchParams.get('search') || ''

        // Only search if the value is different from what's already in the URL
        if (value === currentUrlSearch) {
            return
        }

        const timeoutId = setTimeout(() => {
            handleSearch(value)
        }, 500) // 500ms delay

        return () => clearTimeout(timeoutId)
    }, [value, searchParams, handleSearch])

    return (
        <div className="flex w-full items-center gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="search"
                    placeholder="Search products..."
                    className="input-fresh w-full pl-10 py-3 bg-white"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={() => handleSearch(value)}
                disabled={isPending}
                className="btn-primary px-6 py-3 flex items-center gap-2 shrink-0"
            >
                {isPending ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Search className="h-4 w-4" />
                )}
                Search
            </button>
        </div>
    )
}
