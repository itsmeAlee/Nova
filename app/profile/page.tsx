import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, AtSign } from 'lucide-react'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="h-6 w-6 text-emerald-600" />
                    My Profile
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Manage your personal information and account settings.
                </p>
            </div>

            {/* Profile Card */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700">
                {/* Avatar Section */}
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                        {profile?.first_name
                            ? profile.first_name.charAt(0).toUpperCase()
                            : user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {profile?.first_name && profile?.last_name
                                ? `${profile.first_name} ${profile.last_name}`
                                : 'Your Name'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <AtSign className="h-4 w-4" />
                            {profile?.username || 'username'}
                        </p>
                    </div>
                </div>

                {/* Profile Form (Client Component) */}
                <ProfileForm
                    email={user.email || ''}
                    firstName={profile?.first_name || ''}
                    lastName={profile?.last_name || ''}
                    username={profile?.username || ''}
                />
            </div>

            {/* Account Info Card */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mt-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Account Information</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400">Account Type</span>
                        <span className="font-medium text-slate-900 dark:text-white capitalize">
                            {user.user_metadata?.role || 'Customer'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400">Member Since</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            {new Date(user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-slate-500 dark:text-slate-400">Email Verified</span>
                        <span className={`font-medium ${user.email_confirmed_at ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {user.email_confirmed_at ? 'Yes' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
