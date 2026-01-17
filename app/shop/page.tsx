import Link from 'next/link'
import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ProductCard } from '@/components/ui/product-card'
import { SearchInput } from '@/components/shop/search-input'

interface ShopPageProps {
    searchParams: Promise<{ category?: string; search?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const supabase = await createServerSupabaseClient()
    const { category, search } = await searchParams

    // Fetch departments for sidebar
    const { data: departments } = await supabase
        .from('departments')
        .select('*')
        .order('name')

    // Build products query
    let query = supabase
        .from('products')
        .select('*, departments(name, slug)')

    // Apply category filter if specified
    if (category && category !== 'all') {
        // Find department ID first
        const { data: dept } = await supabase
            .from('departments')
            .select('id')
            .eq('slug', category)
            .single()

        if (dept) {
            query = query.eq('department_id', dept.id)
        }
    }

    // Apply search filter if specified
    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    // Execute query
    const { data: products } = await query.order('created_at', { ascending: false })

    // Get current category name for header
    const currentCategory = category && category !== 'all'
        ? departments?.find(d => d.slug === category)?.name || 'All Products'
        : 'All Products'

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="card-fresh sticky top-24">
                        <h2 className="font-bold text-slate-900 mb-4">Browse Categories</h2>
                        <nav className="space-y-1">
                            {/* All Products Link */}
                            <Link
                                href="/shop"
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!category || category === 'all'
                                        ? 'bg-emerald-100 text-emerald-800 font-medium'
                                        : 'text-slate-600 hover:text-emerald-600'
                                    }`}
                            >
                                All Products
                            </Link>

                            {/* Dynamic Department Links */}
                            {departments?.map((dept) => (
                                <Link
                                    key={dept.id}
                                    href={`/shop?category=${dept.slug}`}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === dept.slug
                                            ? 'bg-emerald-100 text-emerald-800 font-medium'
                                            : 'text-slate-600 hover:text-emerald-600'
                                        }`}
                                >
                                    {dept.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <Suspense fallback={<div className="input-fresh w-full py-3 animate-pulse bg-slate-100" />}>
                            <SearchInput />
                        </Suspense>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{currentCategory}</h1>
                            {search && (
                                <p className="text-slate-500 text-sm mt-1">
                                    Searching for &quot;{search}&quot;
                                </p>
                            )}
                        </div>
                        <p className="text-slate-500">{products?.length ?? 0} items</p>
                    </div>

                    {/* Product Grid */}
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="card-fresh text-center py-12">
                            <p className="text-slate-500 text-lg">
                                {search
                                    ? `No products found for "${search}"`
                                    : 'No products found in this category.'
                                }
                            </p>
                            <Link
                                href="/shop"
                                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                ← Browse all products
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
