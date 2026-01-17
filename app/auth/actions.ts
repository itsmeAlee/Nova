'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData?.get('email') as string
    const password = formData?.get('password') as string

    if (!formData || !email || !password) {
        return { error: 'Email and password are required.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    const role = data.user?.user_metadata?.role
    if (role === 'admin') {
        redirect('/admin')
    } else if (role === 'customer') {
        redirect('/shop')
    } else {
        redirect('/')
    }
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData?.get('email') as string
    const password = formData?.get('password') as string
    const role = formData?.get('role') as string
    const staffId = formData?.get('staffId') as string
    const firstName = formData?.get('first_name') as string
    const lastName = formData?.get('last_name') as string
    const username = formData?.get('username') as string

    if (!formData || !email || !password) {
        return { error: 'Email and password are required.' }
    }

    if (!firstName || !lastName || !username) {
        return { error: 'Please fill in all required fields.' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' }
    }

    // SECRET CODE CHECK FOR STAFF
    if (role === 'admin') {
        if (staffId !== 'FASTTRACK-2026') {
            return { error: 'Invalid Staff Secret ID. Access denied.' }
        }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role: role || 'customer',
                first_name: firstName,
                last_name: lastName,
                username: username.toLowerCase(),
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    if (role === 'admin') {
        redirect('/admin')
    } else if (role === 'customer') {
        redirect('/shop')
    } else {
        redirect('/')
    }
}

export async function signout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/login')
}
