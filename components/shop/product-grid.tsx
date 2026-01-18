'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ProductCard } from '@/components/ui/product-card'
import { Tables } from '@/types/supabase'

type Product = Tables<'products'> & {
    departments?: { name: string; slug: string } | null
    category?: string | null
}

export function ProductGrid({ products }: { products: Product[] }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Step 1: Array-based state for multi-select (empty array = "All Products")
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const categories = searchParams.get('category')?.split(',').filter(Boolean) || []
        return categories
    })

    // Sync with URL changes (when sidebar/external component updates URL)
    useEffect(() => {
        const categories = searchParams.get('category')?.split(',').filter(Boolean) || []
        setSelectedCategories(categories)
    }, [searchParams])

    // Step 2: Toggle function for multi-select
    const toggleCategory = useCallback((category: string) => {
        let newCategories: string[]

        if (category === 'all' || category === 'All Products') {
            // Clear all selections (show all products)
            newCategories = []
        } else if (selectedCategories.some(c => c.toLowerCase() === category.toLowerCase())) {
            // Remove category (already selected)
            newCategories = selectedCategories.filter(c => c.toLowerCase() !== category.toLowerCase())
        } else {
            // Add category
            newCategories = [...selectedCategories, category]
        }

        // Update state
        setSelectedCategories(newCategories)

        // Update URL to keep state synced (per client-state skill: URL state for filtering)
        const params = new URLSearchParams(searchParams.toString())
        if (newCategories.length === 0) {
            params.delete('category')
        } else {
            params.set('category', newCategories.join(','))
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, [selectedCategories, searchParams, router, pathname])

    // Step 3: Multi-category filtering logic
    const filteredProducts = products.filter((product) => {
        // 1. If array is empty, show EVERYTHING (equivalent to "All Products")
        if (selectedCategories.length === 0) return true

        // 2. Helper to normalize strings for comparison
        const normalize = (str: string) => str.trim().toLowerCase()

        // 3. Get all possible category identifiers for this product
        const productIdentifiers: string[] = []
        if (product.category) productIdentifiers.push(normalize(product.category))
        if (product.departments?.slug) productIdentifiers.push(normalize(product.departments.slug))
        if (product.departments?.name) productIdentifiers.push(normalize(product.departments.name))

        // 4. Check if product matches ANY of the selected categories
        return selectedCategories.some(selected =>
            productIdentifiers.includes(normalize(selected))
        )
    })

    // Get display text for selected categories
    const getDisplayText = () => {
        if (selectedCategories.length === 0) return 'All Products'
        if (selectedCategories.length === 1) return selectedCategories[0]
        return `${selectedCategories.length} categories selected`
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground text-lg">
                        No products found in <span className="font-semibold text-foreground">{getDisplayText()}</span>.
                    </p>
                    <button
                        onClick={() => toggleCategory('all')}
                        className="mt-4 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    )
}
