'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { Tables } from '@/types/supabase'

type Product = Tables<'products'>

interface CartItem {
    product: Product
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: number) => void
    decrementItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    getItemCount: (productId: number) => number
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'fasttrack-cart'

export function CartProvider({
    children,
    role = 'guest'
}: {
    children: ReactNode
    role?: string
}) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isHydrated, setIsHydrated] = useState(false)

    // Load cart from localStorage on mount - UNLESS user is Admin/Staff
    useEffect(() => {
        // ADMIN BLOCK: If user is staff, do NOT load persisted cart
        if (role === 'admin' || role === 'staff') {
            setIsHydrated(true)
            return
        }

        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
            try {
                setItems(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e)
            }
        }
        setIsHydrated(true)
    }, [role])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        }
    }, [items, isHydrated])

    const addToCart = useCallback((product: Product) => {
        setItems((current) => {
            const existingIndex = current.findIndex((item) => item.product.id === product.id)
            if (existingIndex >= 0) {
                // Increment quantity
                const updated = [...current]
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1,
                }
                return updated
            }
            // Add new item
            return [...current, { product, quantity: 1 }]
        })
    }, [])

    const removeFromCart = useCallback((productId: number) => {
        setItems((current) => current.filter((item) => item.product.id !== productId))
    }, [])

    // Decrement: if qty > 1 decrease, if qty == 1 remove
    const decrementItem = useCallback((productId: number) => {
        setItems((current) => {
            const item = current.find((i) => i.product.id === productId)
            if (!item) return current

            if (item.quantity <= 1) {
                // Remove item
                return current.filter((i) => i.product.id !== productId)
            }

            // Decrease quantity
            return current.map((i) =>
                i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
            )
        })
    }, [])

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            setItems((current) => current.filter((item) => item.product.id !== productId))
            return
        }
        setItems((current) =>
            current.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        )
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
        // Also nuke from localStorage to prevent stale data on next session
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CART_STORAGE_KEY)
        }
    }, [])

    const getItemCount = useCallback((productId: number): number => {
        const item = items.find((i) => i.product.id === productId)
        return item?.quantity || 0
    }, [items])

    const total = items.reduce(
        (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
        0
    )

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                decrementItem,
                updateQuantity,
                clearCart,
                getItemCount,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
