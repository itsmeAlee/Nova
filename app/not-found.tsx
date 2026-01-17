import Link from 'next/link'
import { Search, Home, Store } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="p-4 bg-slate-100 rounded-full mb-6">
                <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Page Not Found
            </h2>
            <p className="text-slate-500 max-w-md mb-8">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <Home className="h-4 w-4" />
                    Go Home
                </Link>
                <Link
                    href="/shop"
                    className="px-6 py-2 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 text-slate-600 rounded-xl transition-colors font-medium flex items-center justify-center shadow-sm gap-2"
                >
                    <Store className="h-4 w-4" />
                    Browse Shop
                </Link>
            </div>
        </div>
    )
}
