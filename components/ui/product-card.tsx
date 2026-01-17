'use client'

import Image from 'next/image'
import { Tables } from '@/types/supabase'
import { AddToCartControl } from '@/components/shop/add-to-cart-control'

type Product = Tables<'products'>

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = (product.stock_quantity ?? 0) === 0

    return (
        <div className="group relative bg-card text-card-foreground border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
            {/* Product Image */}
            <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-secondary/50">
                <Image
                    src={product.image_url || 'https://placehold.co/400x300?text=Product'}
                    alt={product.name || 'Product'}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {isOutOfStock && (
                    <div className="absolute top-2 right-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-2 py-1 text-sm font-medium">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col p-4 pt-0">
                {/* DEPT Tag Removed */}

                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm md:text-base">
                    {product.name || 'Unnamed Product'}
                </h3>
                <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-auto mb-4">
                    PKR {(product.price ?? 0).toLocaleString()}
                </p>

                {/* Smart Add to Cart Control */}
                {isOutOfStock ? (
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-muted text-muted-foreground cursor-not-allowed"
                    >
                        Out of Stock
                    </button>
                ) : (
                    <AddToCartControl product={product} />
                )}
            </div>
        </div>
    )
}
