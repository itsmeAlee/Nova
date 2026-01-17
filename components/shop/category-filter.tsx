'use client'

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'

interface Department {
    id: number
    name: string
    slug: string
}

interface CategoryFilterProps {
    departments: Department[]
}

// Manual categories to inject (High Priority)
const MANUAL_CATEGORIES = [
    { id: 9999, name: 'Northern Gifts', slug: 'Northern Gifts' }
]

export function CategoryFilter({ departments }: CategoryFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Merge manual items with DB departments, avoiding duplicates
    const allDepartments = [
        ...MANUAL_CATEGORIES,
        ...departments.filter(d => !MANUAL_CATEGORIES.some(m => m.slug === d.slug))
    ]

    const currentCategories = searchParams.get('category')?.split(',').filter(Boolean) || []

    const toggleCategory = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString())
        let newCategories: string[]

        if (slug === 'all') {
            // Clear all categories
            params.delete('category')
        } else {
            if (currentCategories.includes(slug)) {
                // Remove category
                newCategories = currentCategories.filter(c => c !== slug)
            } else {
                // Add category
                newCategories = [...currentCategories, slug]
            }

            if (newCategories.length === 0) {
                params.delete('category')
            } else {
                params.set('category', newCategories.join(','))
            }
        }

        router.replace(`${pathname}?${params.toString()}`)
    }

    const isSelected = (slug: string) => currentCategories.includes(slug)
    const isAllSelected = currentCategories.length === 0

    return (
        <>
            {/* Mobile View - Collapsible */}
            <div className="md:hidden mb-4">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-border bg-card text-foreground rounded-xl hover:border-emerald-300 transition-colors"
                >
                    <span className="font-medium">
                        Filter Categories {currentCategories.length > 0 && `(${currentCategories.length})`}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>

                {isOpen && (
                    <div className="mt-2 p-4 border border-border rounded-xl bg-card">
                        <div className="grid grid-cols-2 gap-2">
                            {/* All Products Option */}
                            <button
                                type="button"
                                onClick={() => toggleCategory('all')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isAllSelected
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-medium'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {isAllSelected && <Check className="h-4 w-4" />}
                                All
                            </button>

                            {/* Category Options */}
                            {allDepartments.map((dept) => (
                                <button
                                    key={dept.id}
                                    type="button"
                                    onClick={() => toggleCategory(dept.slug)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isSelected(dept.slug)
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-medium'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    {isSelected(dept.slug) && <Check className="h-4 w-4" />}
                                    <span className="truncate">{dept.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop View - Sidebar (passed via slot, this is just the filter logic) */}
        </>
    )
}

// Separate Desktop Sidebar Component
export function CategorySidebar({ departments }: CategoryFilterProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Merge manual items here as well
    const allDepartments = [
        ...MANUAL_CATEGORIES,
        ...departments.filter(d => !MANUAL_CATEGORIES.some(m => m.slug === d.slug))
    ]

    const currentCategories = searchParams.get('category')?.split(',').filter(Boolean) || []

    const toggleCategory = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (slug === 'all') {
            params.delete('category')
        } else {
            let newCategories: string[]
            if (currentCategories.includes(slug)) {
                newCategories = currentCategories.filter(c => c !== slug)
            } else {
                newCategories = [...currentCategories, slug]
            }

            if (newCategories.length === 0) {
                params.delete('category')
            } else {
                params.set('category', newCategories.join(','))
            }
        }

        router.replace(`${pathname}?${params.toString()}`)
    }

    const isSelected = (slug: string) => currentCategories.includes(slug)
    const isAllSelected = currentCategories.length === 0

    return (
        <div className="bg-card border border-border rounded-xl p-4 sticky top-24 shadow-sm">
            <h2 className="font-bold text-foreground mb-4">Browse Categories</h2>
            <nav className="space-y-1">
                {/* All Products Link */}
                <button
                    type="button"
                    onClick={() => toggleCategory('all')}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isAllSelected
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-medium'
                        : 'text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-muted'
                        }`}
                >
                    {isAllSelected && <Check className="h-4 w-4" />}
                    All Products
                </button>

                {/* Dynamic Department Links (Including Manual) */}
                {allDepartments.map((dept) => (
                    <button
                        key={dept.id}
                        type="button"
                        onClick={() => toggleCategory(dept.slug)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isSelected(dept.slug)
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-medium'
                            : 'text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-muted'
                            }`}
                    >
                        {isSelected(dept.slug) && <Check className="h-4 w-4" />}
                        {dept.name}
                    </button>
                ))}
            </nav>
        </div>
    )
}
