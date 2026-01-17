import { createServerSupabaseClient } from '@/lib/supabase'
import { StatsCards } from '@/components/admin/stats-cards'
import { InventoryTable } from '@/components/admin/inventory-table'

export default async function AdminPage() {
    const supabase = await createServerSupabaseClient()

    // Fetch products and orders
    const [productsResult, ordersResult] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('orders').select('*'),
    ])

    const products = productsResult.data ?? []
    const orders = ordersResult.data ?? []

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Monitor your inventory and sales at a glance.</p>
            </div>

            {/* Stats Cards */}
            <StatsCards products={products} orders={orders} />

            {/* Inventory Table */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Inventory</h2>
                <InventoryTable products={products} />
            </div>
        </div>
    )
}
