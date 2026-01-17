'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ShoppingCart, X, Home, Store, Shield, LogOut, Package, User, Settings, ChevronDown } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { signout } from '@/app/auth/actions'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
    user?: {
        email?: string
        user_metadata?: {
            role?: string
            first_name?: string
            last_name?: string
            username?: string
        }
    } | null
}

export function Navbar({ user }: NavbarProps) {
    const { itemCount } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const role = user?.user_metadata?.role || 'guest'
    const isStaff = role === 'admin'
    const firstName = user?.user_metadata?.first_name
    const displayName = firstName || 'Account'

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
                            </>
                        )}

                        {/* Cart (for customers only) */}
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

                        {/* Auth / Profile Dropdown */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium text-slate-700 transition-colors">
                                        <div className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="hidden lg:inline">{displayName}</span>
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{displayName}</span>
                                            <span className="text-xs text-slate-500">{user.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    {!isStaff && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-orders" className="flex items-center gap-2 cursor-pointer">
                                                <Package className="h-4 w-4" />
                                                My Orders
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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

                        {/* User Info Banner (if logged in) */}
                        {user && (
                            <div className="p-4 bg-slate-50 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{displayName}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

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

                            {/* Mobile Auth Section */}
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <User className="h-5 w-5 text-slate-400" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <Settings className="h-5 w-5 text-slate-400" />
                                        Settings
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSignOut()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </button>
                                </>
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
