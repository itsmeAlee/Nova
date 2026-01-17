'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Settings, Moon, Bell, Shield, AlertTriangle, Trash2, ChevronLeft } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-48" />
                    <div className="h-40 bg-slate-100 rounded-xl" />
                    <div className="h-40 bg-slate-100 rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/profile"
                    className="text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1 mb-4"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Profile
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="h-6 w-6 text-emerald-600" />
                    Account Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Manage your preferences and account settings.
                </p>
            </div>

            {/* Appearance Section */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Moon className="h-5 w-5 text-slate-400" />
                    Appearance
                </h2>
                <div className="flex items-center justify-between py-3">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Switch to a darker color scheme</p>
                    </div>
                    <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </div>
            </div>

            {/* Notifications Section */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Bell className="h-5 w-5 text-slate-400" />
                    Notifications
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Order Updates</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about your order status</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Promotional Emails</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive deals and promotional offers</p>
                        </div>
                        <Switch />
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-6">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-slate-400" />
                    Privacy
                </h2>
                <div className="flex items-center justify-between py-3">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">Profile Visibility</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow others to see your profile</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card-fresh border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20">
                <h2 className="font-semibold text-red-600 flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                    type="button"
                    className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                </button>
            </div>

            {/* Footer Note */}
            <p className="text-center text-slate-400 text-sm mt-8">
                Settings are automatically saved when you make changes.
            </p>
        </div>
    )
}
