import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ProductCard } from '@/components/ui/product-card'

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  // Fetch newest 3 products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[50vh] text-center mb-16">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4">
          <span className="text-emerald-600">FASTTRACK</span> your shopping.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-8">
          The world&apos;s first Expiry-Aware live inventory system.
        </p>
        <Link
          href="/shop"
          className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Browsing
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Fresh Arrivals</h2>
          <Link
            href="/shop"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {(!featuredProducts || featuredProducts.length === 0) && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No products available yet
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
