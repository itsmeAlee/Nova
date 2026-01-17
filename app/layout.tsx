import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { CartProvider } from '@/components/providers/cart-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ThemeReset } from '@/components/layout/theme-reset'
import { createClient } from '@/utils/supabase/server'
import { createServerSupabaseClient } from '@/lib/supabase'

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

  // Fetch low stock count for Staff users
  let lowStockCount = 0
  if (user?.user_metadata?.role === 'admin') {
    const dbClient = await createServerSupabaseClient()
    const { count } = await dbClient
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lt('stock_quantity', 10)
    lowStockCount = count || 0
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <ThemeReset />
          <CartProvider>
            <Navbar user={user} lowStockCount={lowStockCount} />
            <main>{children}</main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
