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
        <div className="card-fresh group flex flex-col h-full">
            {/* Product Image */}
            <div className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden bg-slate-100">
                <Image
                    src={product.image_url || 'https://placehold.co/400x300?text=Product'}
                    alt={product.name || 'Product'}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {isOutOfStock && (
                    <div className="absolute top-2 right-2 status-expired">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                    Dept {product.department_id || '—'}
                </p>
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm md:text-base">
                    {product.name || 'Unnamed Product'}
                </h3>
                <p className="text-xl md:text-2xl font-bold price-tag mt-auto mb-4">
                    PKR {(product.price ?? 0).toLocaleString()}
                </p>

                {/* Smart Add to Cart Control */}
                {isOutOfStock ? (
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
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
