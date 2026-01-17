'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="p-4 bg-red-50 rounded-full mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Something went wrong!
            </h2>
            <p className="text-slate-500 max-w-md mb-8">
                We apologize for the inconvenience. An unexpected error occurred while processing your request.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={reset}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="px-6 py-2 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 text-slate-600 rounded-xl transition-colors font-medium flex items-center justify-center"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
