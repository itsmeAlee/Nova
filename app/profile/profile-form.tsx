'use client'

import { useActionState } from 'react'
import { Mail, AtSign, Save, Loader2, CheckCircle } from 'lucide-react'
import { updateProfile } from './actions'

interface ProfileFormProps {
    email: string
    firstName: string
    lastName: string
    username: string
}

export function ProfileForm({ email, firstName, lastName, username }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(updateProfile, null)

    return (
        <form action={formAction} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="email"
                        id="email"
                        value={email}
                        disabled
                        className="input-fresh w-full pl-10 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                    Email is tied to your account and cannot be changed.
                </p>
            </div>

            {/* Username (Read-only / Locked) */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Username
                </label>
                <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        id="username"
                        value={username}
                        disabled
                        className="input-fresh w-full pl-10 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                    Username cannot be changed after account creation.
                </p>
            </div>

            {/* Name Fields Row (Editable) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        defaultValue={firstName}
                        required
                        placeholder="John"
                        className="input-fresh w-full dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        defaultValue={lastName}
                        required
                        placeholder="Doe"
                        className="input-fresh w-full dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                </div>
            </div>

            {/* Status Messages */}
            {state?.message && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${state.success
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                    }`}>
                    {state.success && <CheckCircle className="h-4 w-4" />}
                    {state.message}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="h-5 w-5" />
                        Save Changes
                    </>
                )}
            </button>
        </form>
    )
}
