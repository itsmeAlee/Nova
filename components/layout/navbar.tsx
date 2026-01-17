'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ShoppingCart, X, Home, Store, Shield, LogOut, Package, LayoutDashboard, ClipboardList } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { signout } from '@/app/auth/actions'

interface NavbarProps {
    user?: {
        email?: string
        user_metadata?: {
            role?: string
        }
    } | null
}

export function Navbar({ user }: NavbarProps) {
    const { itemCount } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const role = user?.user_metadata?.role || 'guest'
    const isStaff = role === 'admin'

    const handleSignOut = async () => {
        await signout()
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-sm">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link href="/" className="font-extrabold tracking-tighter text-2xl italic text-emerald-600">
                        FASTTRACK
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                        >
                            Home
                        </Link>

                        {/* Staff Navigation */}
                        {isStaff ? (
                            <>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Package className="h-4 w-4" />
                                    Inventory
                                </Link>
                            </>
                        ) : (
                            // Customer Navigation
                            <>
                                <Link
                                    href="/shop"
                                    className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                                >
                                    Shop
                                </Link>
                                {user && (
                                    <Link
                                        href="/my-orders"
                                        className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                )}
                            </>
                        )}

                        {/* Common Elements */}
                        {!isStaff && (
                            <Link
                                href="/checkout"
                                className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-emerald-500 rounded-full shadow-sm">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {user ? (
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 text-slate-600 rounded-lg text-sm font-medium transition-colors"
                            >
                                Login / Signup
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {!isStaff && (
                            <Link
                                href="/checkout"
                                className="relative p-2 text-slate-600 hover:text-emerald-600 rounded-full transition-colors"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-emerald-500 rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl md:hidden animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <span className="font-bold text-lg text-slate-900">Menu</span>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <Home className="h-5 w-5 text-slate-400" />
                                Home
                            </Link>

                            {isStaff ? (
                                // Mobile Staff Links
                                <>
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium"
                                    >
                                        <Package className="h-5 w-5" />
                                        Inventory
                                    </Link>
                                </>
                            ) : (
                                // Mobile Customer Links
                                <>
                                    <Link
                                        href="/shop"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <Store className="h-5 w-5 text-slate-400" />
                                        Shop
                                    </Link>
                                    {user && (
                                        <Link
                                            href="/my-orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                        >
                                            <Package className="h-5 w-5 text-slate-400" />
                                            My Orders
                                        </Link>
                                    )}
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
                                </>
                            )}

                            <div className="border-t border-slate-100 my-4" />

                            {/* Mobile Auth Buttons */}
                            {user ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleSignOut()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors font-medium"
                                >
                                    <Shield className="h-5 w-5" />
                                    Login / Signup
                                </Link>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </>
    )
}
