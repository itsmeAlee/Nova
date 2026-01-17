'use client'

import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { Tables } from '@/types/supabase'

type Product = Tables<'products'>

interface AddToCartControlProps {
    product: Product
    variant?: 'default' | 'compact'
}

export function AddToCartControl({ product, variant = 'default' }: AddToCartControlProps) {
    const { addToCart, decrementItem, getItemCount, removeFromCart } = useCart()
    const count = getItemCount(product.id)

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
    }

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        decrementItem(product.id)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        removeFromCart(product.id)
    }

    // COMPACT VARIANT - for checkout/cart pages
    if (variant === 'compact') {
        if (count === 0) return null

        return (
            <div className="flex items-center gap-1">
                {/* Decrement/Remove Button */}
                <button
                    type="button"
                    onClick={count === 1 ? handleRemove : handleDecrement}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                    aria-label={count === 1 ? "Remove" : "Decrease"}
                >
                    {count === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </button>

                {/* Count Display */}
                <span className="w-8 text-center font-bold text-slate-900">{count}</span>

                {/* Increment Button */}
                <button
                    type="button"
                    onClick={handleAdd}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    aria-label="Increase"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        )
    }

    // DEFAULT VARIANT - for product cards
    // State A: Not in cart - show "Add to Cart" button
    if (count === 0) {
        return (
            <button
                type="button"
                onClick={handleAdd}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm font-medium"
            >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
            </button>
        )
    }

    // State B: In cart - show counter controls
    return (
        <div className="w-full flex items-center justify-between gap-2">
            {/* Decrement Button */}
            <button
                type="button"
                onClick={handleDecrement}
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                aria-label="Remove one"
            >
                <Minus className="h-5 w-5" />
            </button>

            {/* Count Display */}
            <div className="flex-1 text-center">
                <span className="text-lg font-bold text-slate-900">{count}</span>
                <span className="text-xs text-slate-500 block">in cart</span>
            </div>

            {/* Increment Button */}
            <button
                type="button"
                onClick={handleAdd}
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                aria-label="Add one more"
            >
                <Plus className="h-5 w-5" />
            </button>
        </div>
    )
}
