'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ui/product-card'
import { Tables } from '@/types/supabase'

type Product = Tables<'products'> & {
    departments?: { name: string; slug: string } | null
}

export function ProductGrid({ products }: { products: Product[] }) {
    const searchParams = useSearchParams()

    // Initialize state from URL or default
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category')?.split(',')[0] || 'All Products'
    )

    // Sync with URL changes (Sidebar interaction)
    useEffect(() => {
        const cat = searchParams.get('category')
        // Take the first category if multiple, or reset
        setSelectedCategory(cat?.split(',')[0] || 'All Products')
    }, [searchParams])

    // Client-side filtering logic
    const filteredProducts = products.filter((product) => {
        if (selectedCategory === "All Products") return true

        // Strict match: "Northern Gifts" === "Northern Gifts"
        // Mapping: product.departments.name OR slug
        const deptName = product.departments?.name
        const deptSlug = product.departments?.slug

        // Handle explicit "Northern Gifts" case regardless of DB inconsistencies
        if (selectedCategory === "Northern Gifts") {
            return deptName === "Northern Gifts" || deptSlug === "Northern Gifts"
        }

        return deptName === selectedCategory || deptSlug === selectedCategory
    })

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground text-lg">
                        No products found in <span className="font-semibold text-foreground">{selectedCategory}</span>.
                    </p>
                    <button
                        onClick={() => setSelectedCategory('All Products')}
                        className="mt-4 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    )
}
