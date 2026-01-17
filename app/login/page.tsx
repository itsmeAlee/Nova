'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Loader2, Shield, User, Key, AtSign } from 'lucide-react'
import { login, signup } from '@/app/auth/actions'
import { useCart } from '@/components/providers/cart-provider'

type AuthState = { error?: string } | null
type Role = 'customer' | 'admin'

export default function LoginPage() {
    const { clearCart } = useCart()
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
    const [selectedRole, setSelectedRole] = useState<Role>('customer')

    const [loginState, loginAction, isLoginPending] = useActionState<AuthState, FormData>(login, null)
    const [signupState, signupAction, isSignupPending] = useActionState<AuthState, FormData>(signup, null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="font-extrabold tracking-tighter text-4xl italic text-emerald-600">
                            FASTTRACK
                        </h1>
                    </Link>
                    <p className="text-muted-foreground mt-2">
                        {selectedRole === 'admin' ? 'Staff Portal Access' : 'Customer Account'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border overflow-hidden">
                    {/* Role Selector */}
                    <div className="p-4 bg-muted/50 border-b border-border flex gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('customer')}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${selectedRole === 'customer'
                                ? 'bg-background text-emerald-600 shadow-sm border border-emerald-100 dark:border-emerald-900/50'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                        >
                            <User className="h-4 w-4" />
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('admin')}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${selectedRole === 'admin'
                                ? 'bg-background text-emerald-600 shadow-sm border border-emerald-100 dark:border-emerald-900/50'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                        >
                            <Shield className="h-4 w-4" />
                            Staff
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        {/* Auth Tabs */}
                        <div className="flex border-b border-border mb-6">
                            <button
                                type="button"
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'login'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('signup')}
                                className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'signup'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Create Account
                            </button>
                        </div>

                        {activeTab === 'login' ? (
                            <form action={loginAction} className="space-y-4">
                                <input type="hidden" name="role" value={selectedRole} />

                                <div>
                                    <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            id="login-email"
                                            name="email"
                                            required
                                            placeholder={selectedRole === 'admin' ? "staff@fasttrack.pk" : "you@example.com"}
                                            className="input-fresh w-full pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="password"
                                            id="login-password"
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            className="input-fresh w-full pl-10"
                                        />
                                    </div>
                                </div>

                                {loginState?.error && (
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                        {loginState.error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoginPending}
                                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                                >
                                    {isLoginPending ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form action={signupAction} className="space-y-4" onSubmit={() => clearCart()}>
                                <input type="hidden" name="role" value={selectedRole} />

                                {/* Name Fields Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-medium text-foreground mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            required
                                            placeholder="Ali"
                                            className="input-fresh w-full"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-medium text-foreground mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            required
                                            placeholder="Khan"
                                            className="input-fresh w-full"
                                        />
                                    </div>
                                </div>

                                {/* Username */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            required
                                            placeholder="alikhan"
                                            pattern="[a-z0-9_]+"
                                            title="Lowercase letters, numbers, and underscores only"
                                            className="input-fresh w-full pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            id="signup-email"
                                            name="email"
                                            required
                                            placeholder={selectedRole === 'admin' ? "staff@fasttrack.pk" : "you@example.com"}
                                            className="input-fresh w-full pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="password"
                                            id="signup-password"
                                            name="password"
                                            required
                                            minLength={6}
                                            placeholder="Min. 6 characters"
                                            className="input-fresh w-full pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Staff Secret ID Code */}
                                {selectedRole === 'admin' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label htmlFor="staffId" className="block text-sm font-medium text-foreground mb-1">
                                            Staff Secret ID
                                        </label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                                            <input
                                                type="text"
                                                id="staffId"
                                                name="staffId"
                                                required
                                                placeholder="Enter store security code"
                                                className="input-fresh w-full pl-10 border-emerald-200 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {signupState?.error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {signupState.error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSignupPending}
                                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                                >
                                    {isSignupPending ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-muted-foreground text-sm mt-6">
                    <Link href="/" className="hover:text-emerald-600 transition-colors">
                        ← Back to Store
                    </Link>
                </p>
            </div>
        </div>
    )
}
