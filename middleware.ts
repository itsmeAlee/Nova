import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Public Assets - Skip
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return supabaseResponse
    }

    // 1. PROTECTED ROUTES (Require Login)
    // Covers: /admin/* AND /my-orders/*
    if (pathname.startsWith('/admin') || pathname.startsWith('/my-orders')) {
        if (!user) {
            // Not logged in -> Redirect to Login
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    // 2. ROLE-BASED ACCESS CONTROL (RBAC)
    // Prevent Customers from accessing Admin areas
    if (pathname.startsWith('/admin')) {
        const role = user?.user_metadata?.role
        // Exact check: Must be 'admin' to pass
        if (role !== 'admin') {
            // Access Denied -> Redirect to Shop
            const url = request.nextUrl.clone()
            url.pathname = '/shop'
            return NextResponse.redirect(url)
        }
    }

    // 3. AUTH PAGE REDIRECTION (Already Logged In)
    if (pathname === '/login' || pathname === '/signup') {
        if (user) {
            const role = user.user_metadata?.role
            const url = request.nextUrl.clone()

            // Redirect based on role
            if (role === 'admin') {
                url.pathname = '/admin'
            } else {
                url.pathname = '/shop'
            }
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
