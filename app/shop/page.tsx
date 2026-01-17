import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ProductCard } from '@/components/ui/product-card'
import { SearchInput } from '@/components/shop/search-input'
import { CategoryFilter, CategorySidebar } from '@/components/shop/category-filter'

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

    // Parse categories (comma-separated)
    const categories = category?.split(',').filter(Boolean) || []

    // Build products query
    let query = supabase
        .from('products')
        .select('*, departments(name, slug)')

    // Apply category filter if specified (multi-select support)
    if (categories.length > 0) {
        // Find department IDs for selected slugs
        const { data: selectedDepts } = await supabase
            .from('departments')
            .select('id')
            .in('slug', categories)

        if (selectedDepts && selectedDepts.length > 0) {
            const deptIds = selectedDepts.map(d => d.id)
            query = query.in('department_id', deptIds)
        }
    }

    // Apply search filter if specified
    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    // Execute query
    const { data: products } = await query.order('created_at', { ascending: false })

    // Get current category names for header
    const selectedCategoryNames = categories.length > 0
        ? departments?.filter(d => categories.includes(d.slug)).map(d => d.name).join(', ') || 'Filtered'
        : 'All Products'

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Mobile: Search + Filter */}
            <div className="md:hidden mb-6">
                <Suspense fallback={<div className="input-fresh w-full py-3 animate-pulse bg-slate-100" />}>
                    <SearchInput />
                </Suspense>
                <div className="mt-4">
                    <Suspense fallback={null}>
                        <CategoryFilter departments={departments || []} />
                    </Suspense>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 shrink-0">
                    <Suspense fallback={null}>
                        <CategorySidebar departments={departments || []} />
                    </Suspense>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Desktop Search Bar */}
                    <div className="hidden md:block mb-6">
                        <Suspense fallback={<div className="input-fresh w-full py-3 animate-pulse bg-slate-100" />}>
                            <SearchInput />
                        </Suspense>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{selectedCategoryNames}</h1>
                            {search && (
                                <p className="text-slate-500 text-sm mt-1">
                                    Searching for &quot;{search}&quot;
                                </p>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm">{products?.length ?? 0} items</p>
                    </div>

                    {/* Product Grid - 2 columns on mobile */}
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
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
                            <a
                                href="/shop"
                                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                ← Browse all products
                            </a>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
