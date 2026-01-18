'use client';

import { usePathname } from 'next/navigation';
import { FloatingCartButton } from './floating-cart-btn';

export function FloatingCartWrapper() {
    const pathname = usePathname();

    // ACTION 2: Key-Based Re-Mounting
    // Force the component to destroy and recreate on every route change.
    // This wipes any internal state and forces a fresh "Guard Clause" check.
    return <FloatingCartButton key={pathname} />;
}
