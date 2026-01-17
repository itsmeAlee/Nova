'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    Settings,
    Moon,
    Bell,
    Shield,
    AlertTriangle,
    Trash2,
    ChevronLeft,
    Package,
    Mail,
    Volume2,
    BarChart3,
    ShoppingBag
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [userRole, setUserRole] = useState<string>('customer')
    const [loading, setLoading] = useState(true)

    // Fetch user role on mount
    useEffect(() => {
        setMounted(true)
        async function fetchUser() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.user_metadata?.role) {
                setUserRole(user.user_metadata.role)
            }
            setLoading(false)
        }
        fetchUser()
    }, [])

    if (!mounted || loading) {
        return (
            <div className="w-full max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
                <div className="max-w-2xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-48" />
                        <div className="h-40 bg-muted/50 rounded-xl" />
                        <div className="h-40 bg-muted/50 rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    const isStaff = userRole === 'admin'

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
            <div className="max-w-2xl">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <Link
                        href={isStaff ? '/' : '/profile'}
                        className="text-sm text-muted-foreground hover:text-emerald-600 flex items-center gap-1 mb-4"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {isStaff ? 'Back to Dashboard' : 'Back to Profile'}
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                        {isStaff ? 'Staff Settings' : 'Account Settings'}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isStaff
                            ? 'Manage your workspace and notification preferences.'
                            : 'Manage your preferences and account settings.'
                        }
                    </p>
                </div>

                {/* ============================================ */}
                {/* COMMON: Appearance Section */}
                {/* ============================================ */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-4 sm:mb-6">
                    <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                        <Moon className="h-5 w-5 text-muted-foreground" />
                        Appearance
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
                        <div className="min-w-0">
                            <p className="font-medium text-foreground">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">Switch to a darker color scheme</p>
                        </div>
                        <Switch
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            className="shrink-0"
                        />
                    </div>
                </div>

                {/* ============================================ */}
                {/* STAFF ONLY: Workspace Preferences */}
                {/* ============================================ */}
                {isStaff && (
                    <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-4 sm:mb-6">
                        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            Workspace Preferences
                        </h2>
                        <div className="space-y-1">
                            {/* Low Stock Alerts */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-border">
                                <div className="flex items-start gap-3 min-w-0">
                                    <Package className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Low Stock Alerts</p>
                                        <p className="text-sm text-muted-foreground">Get notified when items drop below 10 units</p>
                                    </div>
                                </div>
                                <Switch defaultChecked className="shrink-0" />
                            </div>

                            {/* New Order Chime */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-border">
                                <div className="flex items-start gap-3 min-w-0">
                                    <Volume2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">New Order Chime</p>
                                        <p className="text-sm text-muted-foreground">Play a sound when a new order arrives</p>
                                    </div>
                                </div>
                                <Switch className="shrink-0" />
                            </div>

                            {/* Daily Report */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <BarChart3 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Daily Report</p>
                                        <p className="text-sm text-muted-foreground">Receive a daily sales summary via email</p>
                                    </div>
                                </div>
                                <Switch defaultChecked className="shrink-0" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================ */}
                {/* CUSTOMER ONLY: Shopping Preferences */}
                {/* ============================================ */}
                {!isStaff && (
                    <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-4 sm:mb-6">
                        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                            Shopping Preferences
                        </h2>
                        <div className="space-y-1">
                            {/* Order Updates */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-border">
                                <div className="flex items-start gap-3 min-w-0">
                                    <Package className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Order Updates</p>
                                        <p className="text-sm text-muted-foreground">Get notified about your order status</p>
                                    </div>
                                </div>
                                <Switch defaultChecked className="shrink-0" />
                            </div>

                            {/* Promotional Emails */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <Mail className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Promotional Emails</p>
                                        <p className="text-sm text-muted-foreground">Receive deals and promotional offers</p>
                                    </div>
                                </div>
                                <Switch className="shrink-0" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================ */}
                {/* COMMON: Privacy Section */}
                {/* ============================================ */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-4 sm:mb-6">
                    <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        Privacy
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
                        <div className="min-w-0">
                            <p className="font-medium text-foreground">Profile Visibility</p>
                            <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                        </div>
                        <Switch defaultChecked className="shrink-0" />
                    </div>
                </div>

                {/* ============================================ */}
                {/* COMMON: Danger Zone */}
                {/* ============================================ */}
                <div className="card-fresh border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20">
                    <h2 className="font-semibold text-red-600 flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        type="button"
                        className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-red-300 dark:border-red-700 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center sm:justify-start gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                    </button>
                </div>

                {/* Footer Note */}
                <p className="text-center text-muted-foreground text-sm mt-6 sm:mt-8">
                    Settings are automatically saved when you make changes.
                </p>
            </div>
        </div>
    )
}
