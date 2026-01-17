import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase'
import { SearchInput } from '@/components/shop/search-input'
import { CategoryFilter, CategorySidebar } from '@/components/shop/category-filter'
import { ProductGrid } from '@/components/shop/product-grid'

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

    // Prepare filter display text
    const categories = category?.split(',').filter(Boolean) || []
    const selectedCategoryNames = categories.length > 0
        ? categories.join(', ') // Use raw values since we might have manual filters
        : 'All Products'

    // Fetch ALL products (or search-filtered) for Client-Side Filtering
    let query = supabase
        .from('products')
        .select('*, departments(name, slug)')

    // Server-side SEARCH is still efficient
    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    // Execute query - Limit to reasonable amount if needed, but for now fetch all 
    // to ensure client filter works on full set
    const { data: products } = await query.order('created_at', { ascending: false }).limit(100)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Mobile: Search + Filter */}
            <div className="md:hidden mb-6">
                <Suspense fallback={<div className="input-fresh w-full py-3 animate-pulse bg-muted" />}>
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
                        <Suspense fallback={<div className="input-fresh w-full py-3 animate-pulse bg-muted" />}>
                            <SearchInput />
                        </Suspense>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-foreground capitalize">{selectedCategoryNames}</h1>
                            {search && (
                                <p className="text-muted-foreground text-sm mt-1">
                                    Searching for &quot;{search}&quot;
                                </p>
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm">{products?.length ?? 0} loaded</p>
                    </div>

                    {/* Client-Side Filtered Grid */}
                    <ProductGrid products={products || []} />

                </main>
            </div>
        </div>
    )
}
