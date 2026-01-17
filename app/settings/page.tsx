import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, Moon, Bell, Mail, AlertTriangle, Trash2, ChevronLeft } from 'lucide-react'

export default async function SettingsPage() {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

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
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-emerald-600" />
                    Account Settings
                </h1>
                <p className="text-slate-500 mt-1">
                    Manage your preferences and account settings.
                </p>
            </div>

            {/* Appearance Section */}
            <div className="card-fresh mb-6">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <Moon className="h-5 w-5 text-slate-400" />
                    Appearance
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                            <p className="font-medium text-slate-900">Dark Mode</p>
                            <p className="text-sm text-slate-500">Switch to a darker color scheme</p>
                        </div>
                        {/* Toggle Switch (Visual Only) */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="card-fresh mb-6">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <Bell className="h-5 w-5 text-slate-400" />
                    Notifications
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                            <p className="font-medium text-slate-900">Order Updates</p>
                            <p className="text-sm text-slate-500">Get notified about your order status</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-900">Promotional Emails</p>
                            <p className="text-sm text-slate-500">Receive deals and promotional offers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Privacy Section */}
            <div className="card-fresh mb-6">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-slate-400" />
                    Privacy
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-slate-900">Profile Visibility</p>
                            <p className="text-sm text-slate-500">Allow others to see your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card-fresh border-red-200 bg-red-50/30">
                <h2 className="font-semibold text-red-600 flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                    type="button"
                    className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
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
