'use client'

import Link from 'next/link'
import { Menu, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'

export function Navbar() {
    const { itemCount } = useCart()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-sm">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="font-extrabold tracking-tighter text-2xl italic text-emerald-600">
                    FASTTRACK
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/shop"
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Shop Now
                    </Link>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        Staff Portal
                    </Link>
                    <Link
                        href="/checkout"
                        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-emerald-500 rounded-full">
                                {itemCount > 9 ? '9+' : itemCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center gap-2">
                    <Link
                        href="/checkout"
                        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-emerald-500 rounded-full">
                                {itemCount > 9 ? '9+' : itemCount}
                            </span>
                        )}
                    </Link>
                    <button
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </nav>
        </header>
    )
}
