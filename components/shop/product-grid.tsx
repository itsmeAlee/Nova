'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ui/product-card'
import { Tables } from '@/types/supabase'

type Product = Tables<'products'> & {
    departments?: { name: string; slug: string } | null
    category?: string | null
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
        // 1. Show all if category is "All Products"
        if (selectedCategory === "All Products") return true;

        // 2. Safety Check: If product has no category, skip it
        if (!product.category) return false;

        // 3. Robust Comparison (Ignore Capitalization/Spaces)
        return product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
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
