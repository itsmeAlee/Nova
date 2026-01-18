'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tables } from '@/types/supabase'
import { AddToCartControl } from '@/components/shop/add-to-cart-control'

type Product = Tables<'products'>

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false)
    const isOutOfStock = (product.stock_quantity ?? 0) === 0

    return (
        <div className="group relative bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
            {/* Product Image */}
            <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-secondary/50">
                <Image
                    src={imageError ? 'https://placehold.co/400x300?text=No+Image' : (product.image_url || 'https://placehold.co/400x300?text=Product')}
                    alt={product.name || 'Product'}
                    fill
                    unoptimized
                    onError={() => setImageError(true)}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-2 py-1 text-sm font-medium">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info - Responsive padding */}
            <div className="flex-1 flex flex-col p-3 sm:p-4">
                {/* Product Name - Truncatable */}
                <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base min-h-[2.25rem] sm:min-h-[2.75rem]">
                    {product.name || 'Unnamed Product'}
                </h3>

                {/* Price - with min-w-0 for proper truncation */}
                <div className="flex-1 min-w-0 mt-1">
                    <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">
                        PKR {(product.price ?? 0).toLocaleString()}
                    </p>
                </div>

                {/* Add to Cart Control - Protected with responsive spacing */}
                <div className="mt-3 pt-2">
                    {isOutOfStock ? (
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm font-medium bg-muted text-muted-foreground cursor-not-allowed"
                        >
                            Out of Stock
                        </button>
                    ) : (
                        <AddToCartControl product={product} />
                    )}
                </div>
            </div>
        </div>
    )
}
