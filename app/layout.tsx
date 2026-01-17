import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { CartProvider } from '@/components/providers/cart-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { createClient } from '@/utils/supabase/server'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'FastTrack - Expiry-Aware Inventory System',
  description: 'The world\'s first expiry-aware live inventory system for modern retail.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`}>
        <ThemeProvider>
          <CartProvider>
            <Navbar user={user} />
            <main>{children}</main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
