'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/providers/cart-provider';
import Link from 'next/link';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export function FloatingCartButton() {
    const { itemCount, total } = useCart();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [isStaff, setIsStaff] = useState(false);

    // 1. Prevent Hydration Mismatch & Check User Role
    useEffect(() => {
        setIsMounted(true);

        // 2. Check Role - Hide for Staff/Admin
        const checkRole = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.role === 'staff' || user?.user_metadata?.role === 'admin') {
                setIsStaff(true);
            }
        };
        checkRole();
    }, []);

    // === VISIBILITY RULES (Order is CRITICAL) ===

    // Rule 1: Wait for client-side mount to prevent hydration mismatch
    if (!isMounted) return null;

    // Rule 2: SAFETY LOCK - Admin/Auth pages ALWAYS hidden (overrides everything)
    // This check MUST happen before cart check to prevent showing on admin even with items
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth') || pathname?.startsWith('/login')) {
        return null;
    }

    // Rule 3: Hide for Staff/Admin users globally (they don't shop)
    if (isStaff) return null;

    // Rule 4: Hide on Cart/Checkout pages (redundant to show there)
    if (pathname === '/cart' || pathname === '/checkout') return null;

    // Rule 5: Hide on Homepage (optional - show only in shop context)
    if (pathname === '/') return null;

    // Rule 6: Empty cart = hidden (button appears only after adding items)
    if (itemCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:bottom-8 md:right-8 md:w-auto md:left-auto animate-in slide-in-from-bottom duration-300">
            <Link href="/checkout">
                <div className={cn(
                    "flex items-center justify-between px-4 py-3 md:py-3 md:px-6 rounded-full shadow-2xl cursor-pointer",
                    "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
                    "text-white transition-all transform hover:scale-105 active:scale-95",
                    "border border-emerald-400/30"
                )}>
                    {/* Left Side: Count & Total */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                            <span className="absolute -top-2 -right-2 bg-white text-emerald-600 text-[10px] md:text-xs font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
                                {itemCount > 9 ? '9+' : itemCount}
                            </span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-sm md:text-base">
                                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                            </span>
                            <span className="text-[10px] md:text-xs text-emerald-100 font-medium">
                                PKR {total.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Action */}
                    <div className="flex items-center gap-2 pl-4 md:pl-6 border-l border-emerald-400/30 ml-4 md:ml-6">
                        <span className="font-semibold text-sm md:text-base">View Cart</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
