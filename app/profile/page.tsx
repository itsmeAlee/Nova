import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, AtSign, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
        <div className="w-full max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
            <div className="max-w-2xl">
                {/* Back Navigation */}
                <Button variant="ghost" size="sm" asChild className="mb-4 pl-0 text-muted-foreground hover:text-foreground">
                    <Link href="/" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        My Profile
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your personal information and account settings.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm overflow-hidden p-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border">
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                            {profile?.first_name
                                ? profile.first_name.charAt(0).toUpperCase()
                                : user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">
                                {profile?.first_name && profile?.last_name
                                    ? `${profile.first_name} ${profile.last_name}`
                                    : 'Your Name'}
                            </h2>
                            <p className="text-muted-foreground flex items-center gap-1">
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
                <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm overflow-hidden p-6 mt-6">
                    <h3 className="font-semibold text-foreground mb-4">Account Information</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Account Type</span>
                            <span className="font-medium text-foreground capitalize">
                                {user.user_metadata?.role || 'Customer'}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Member Since</span>
                            <span className="font-medium text-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Email Verified</span>
                            <span className={`font-medium ${user.email_confirmed_at ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {user.email_confirmed_at ? 'Yes' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
