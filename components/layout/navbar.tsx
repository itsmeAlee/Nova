'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ShoppingCart, X, Home, Store, Shield } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'

export function Navbar() {
    const { itemCount } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
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
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Sheet/Drawer */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50 bg-black/50 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl md:hidden animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <span className="font-bold text-lg text-slate-900">Menu</span>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="p-4 space-y-2">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <Home className="h-5 w-5 text-slate-400" />
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <Store className="h-5 w-5 text-slate-400" />
                                Shop
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <ShoppingCart className="h-5 w-5 text-slate-400" />
                                <span>Cart</span>
                                {itemCount > 0 && (
                                    <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-emerald-500 rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <div className="border-t border-slate-100 my-4" />

                            <Link
                                href="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <Shield className="h-5 w-5" />
                                Admin Dashboard
                            </Link>
                        </nav>
                    </div>
                </>
            )}
        </>
    )
}
