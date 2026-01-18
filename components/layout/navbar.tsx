'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Menu, ShoppingCart, X, Home, Store, LogOut, Package, User as UserIcon, Settings, ChevronDown, ClipboardList } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { createClient } from '@/utils/supabase/client'
import { NavLink, MobileNavLink } from '@/components/layout/nav-link'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
    user?: User | null // Optional initial user state if passed from server
    lowStockCount?: number
}

export function Navbar({ user: initialUser, lowStockCount = 0 }: NavbarProps) {
    // Initialize state from prop, but allow it to drift via client-side updates
    const [user, setUser] = useState<User | null>(initialUser as User | null)
    const { itemCount, clearCart } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { setTheme } = useTheme()
    const router = useRouter()

    // Stable client instance to prevent effect re-running unnecessarily
    const supabase = useMemo(() => createClient(), [])

    // Sync state if server sends new data (e.g. after router.refresh())
    useEffect(() => {
        setUser(initialUser as User | null)
    }, [initialUser])

    // Auth State Listener
    useEffect(() => {
        // 1. Check active session immediately on mount
        supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
            if (data.user) {
                // Only update if different to avoid potential flickers/loops? 
                // Actually setUser is cheap if value is same.
                setUser(data.user)
            }
        })

        // 2. Setup Real-time Listener (Hybrid Sync)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            const newUser = session?.user ?? null

            // A. Immediate Client Update (The Instant Fix)
            setUser(newUser)

            // B. Background Server Sync
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                // Refresh server components to update data protected by middleware/RSC
                router.refresh()
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase, router])

    // Derived state from the user object
    const role = user?.user_metadata?.role || 'guest'
    const isStaff = role === 'admin'
    const firstName = user?.user_metadata?.first_name
    const displayName = firstName || 'Account'
    const hasLowStock = lowStockCount > 0

    const handleSignOut = async () => {
        // 1. Clear Cart Data
        clearCart()
        // 2. Force Light Mode immediately
        setTheme('light')
        // 3. Update State Immediately (Optimistic UI)
        setUser(null)
        // 4. Clear Session
        await supabase.auth.signOut()
        // 5. FORCE REDIRECT (replace prevents back button returning to protected page)
        router.replace('/login')
        // 6. Clear Server Cache after redirect
        router.refresh()
    }

    return (
        <>
            <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center text-2xl font-black italic tracking-tighter text-black dark:text-white uppercase hover:opacity-80 transition-opacity">
                        NOVA
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/" icon={Home} label="Home" />

                        {/* Staff Navigation */}
                        {isStaff && (
                            <>
                                <NavLink
                                    href="/admin"
                                    icon={Package}
                                    label="Inventory"
                                    alert={hasLowStock}
                                />
                                <NavLink
                                    href="/admin/orders"
                                    icon={ClipboardList}
                                    label="Orders"
                                />
                            </>
                        )}

                        {/* Customer Navigation */}
                        {!isStaff && (
                            <NavLink href="/shop" icon={Store} label="Shop" />
                        )}

                        {/* Cart (for customers only) */}
                        {!isStaff && (
                            <Link
                                href="/checkout"
                                className="relative p-2 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-accent rounded-lg transition-colors ml-2"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-emerald-500 rounded-full shadow-sm">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Auth / Profile Dropdown */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-2">
                                        <div className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="hidden lg:inline">{displayName}</span>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground border-border">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{displayName}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                                            <UserIcon className="h-4 w-4" />
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
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors ml-2"
                            >
                                Login / Signup
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Cart Icon (customers only) */}
                        {!isStaff && (
                            <Link
                                href="/checkout"
                                className="relative p-2 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-emerald-500 rounded-full">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Conditional: Show Login button when logged out, Hamburger when logged in */}
                        {user ? (
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed top-0 right-0 z-50 h-full w-72 bg-background border-l border-border shadow-xl md:hidden animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <span className="font-bold text-lg text-foreground">Menu</span>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-muted-foreground hover:bg-muted rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* User Info Banner (if logged in) */}
                        {user && (
                            <div className="p-4 bg-muted/50 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{displayName}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            <MobileNavLink
                                href="/"
                                icon={Home}
                                label="Home"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {isStaff ? (
                                // Mobile Staff Links
                                <>
                                    <MobileNavLink
                                        href="/admin"
                                        icon={Package}
                                        label="Inventory"
                                        alert={hasLowStock}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                    <MobileNavLink
                                        href="/admin/orders"
                                        icon={ClipboardList}
                                        label="Orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                </>
                            ) : (
                                // Mobile Customer Links
                                <>
                                    <MobileNavLink
                                        href="/shop"
                                        icon={Store}
                                        label="Shop"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                    {user && (
                                        <MobileNavLink
                                            href="/my-orders"
                                            icon={Package}
                                            label="My Orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        />
                                    )}
                                    {/* Cart link removed - already visible in top bar */}
                                </>
                            )}

                            <div className="border-t border-border my-4" />

                            {/* Mobile Auth Section */}
                            {user ? (
                                <>
                                    <MobileNavLink
                                        href="/profile"
                                        icon={UserIcon}
                                        label="Profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                    <MobileNavLink
                                        href="/settings"
                                        icon={Settings}
                                        label="Settings"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleSignOut()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-colors font-medium dark:text-emerald-400"
                                >
                                    <UserIcon className="h-5 w-5" />
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
