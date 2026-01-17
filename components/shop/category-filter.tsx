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

export function CategoryFilter({ departments }: CategoryFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

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
                    className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-slate-700 hover:border-emerald-300 transition-colors"
                >
                    <span className="font-medium">
                        Filter Categories {currentCategories.length > 0 && `(${currentCategories.length})`}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                </button>

                {isOpen && (
                    <div className="mt-2 p-4 border border-slate-200 rounded-xl bg-white">
                        <div className="grid grid-cols-2 gap-2">
                            {/* All Products Option */}
                            <button
                                type="button"
                                onClick={() => toggleCategory('all')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isAllSelected
                                        ? 'bg-emerald-100 text-emerald-800 font-medium'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {isAllSelected && <Check className="h-4 w-4" />}
                                All
                            </button>

                            {/* Category Options */}
                            {departments.map((dept) => (
                                <button
                                    key={dept.id}
                                    type="button"
                                    onClick={() => toggleCategory(dept.slug)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isSelected(dept.slug)
                                            ? 'bg-emerald-100 text-emerald-800 font-medium'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
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
        <div className="card-fresh sticky top-24">
            <h2 className="font-bold text-slate-900 mb-4">Browse Categories</h2>
            <nav className="space-y-1">
                {/* All Products Link */}
                <button
                    type="button"
                    onClick={() => toggleCategory('all')}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isAllSelected
                            ? 'bg-emerald-100 text-emerald-800 font-medium'
                            : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                        }`}
                >
                    {isAllSelected && <Check className="h-4 w-4" />}
                    All Products
                </button>

                {/* Dynamic Department Links */}
                {departments.map((dept) => (
                    <button
                        key={dept.id}
                        type="button"
                        onClick={() => toggleCategory(dept.slug)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isSelected(dept.slug)
                                ? 'bg-emerald-100 text-emerald-800 font-medium'
                                : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
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
