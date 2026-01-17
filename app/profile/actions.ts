'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

interface UpdateProfileState {
    success: boolean
    message: string
}

export async function updateProfile(
    prevState: UpdateProfileState | null,
    formData: FormData
): Promise<UpdateProfileState> {
    try {
        const supabase = await createClient()

        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { success: false, message: 'You must be logged in to update your profile.' }
        }

        // 2. Extract form data
        const firstName = formData.get('first_name') as string
        const lastName = formData.get('last_name') as string
        const username = formData.get('username') as string

        // 3. Validate
        if (!firstName || !lastName || !username) {
            return { success: false, message: 'Please fill in all required fields.' }
        }

        // Username validation (lowercase, alphanumeric, underscores)
        const usernameRegex = /^[a-z0-9_]+$/
        if (!usernameRegex.test(username)) {
            return { success: false, message: 'Username can only contain lowercase letters, numbers, and underscores.' }
        }

        // 4. Update profiles table
        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                username: username.toLowerCase(),
            })
            .eq('id', user.id)

        if (error) {
            console.error('Profile update error:', error)
            if (error.code === '23505') {
                return { success: false, message: 'This username is already taken.' }
            }
            return { success: false, message: 'Failed to update profile. Please try again.' }
        }

        // 5. Also update user_metadata in auth
        await supabase.auth.updateUser({
            data: {
                first_name: firstName,
                last_name: lastName,
                username: username.toLowerCase(),
            }
        })

        // 6. Revalidate
        revalidatePath('/profile')
        revalidatePath('/', 'layout')

        return { success: true, message: 'Profile updated successfully!' }
    } catch (error) {
        console.error('Profile update error:', error)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}
