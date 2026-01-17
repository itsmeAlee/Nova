import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/ui/product-card'
import { DashboardView } from '@/components/admin/dashboard-view'
import { FeaturedCollection } from '@/components/home/featured-collection'
import { getDashboardStats } from '@/app/admin/analytics'

export default async function Home() {
  // 1. Get Current User & Role
  const supabaseAuth = await createClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  const role = user?.user_metadata?.role

  // 2. IF STAFF -> Show Admin Dashboard with preloaded data
  if (role === 'admin') {
    const initialStats = await getDashboardStats('7d')
    return <DashboardView initialStats={initialStats} />
  }

  // 3. OTHERWISE -> Show Customer/Guest Marketing Page
  const supabase = await createServerSupabaseClient()

  // Fetch newest 3 products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh] text-center mb-8 sm:mb-16">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          <span className="text-emerald-600 dark:text-emerald-400">FASTTRACK</span> your shopping.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          The world&apos;s first Expiry-Aware live inventory system.
        </p>
        <Link
          href="/shop"
          className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Browsing
        </Link>
      </section>

      {/* Northern Gifts Featured Collection Banner */}
      <FeaturedCollection />

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Fresh Arrivals</h2>
          <Link
            href="/shop"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {(!featuredProducts || featuredProducts.length === 0) && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No products available yet
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
