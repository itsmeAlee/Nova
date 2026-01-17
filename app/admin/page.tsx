import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { StatsCards } from '@/components/admin/stats-cards'
import { InventoryTable } from '@/components/admin/inventory-table'
import { AddProductDialog } from '@/components/admin/add-product-dialog'
import { RestockDialog } from '@/components/admin/restock-dialog'
import { Package, ChevronLeft } from 'lucide-react'

export default async function AdminPage() {
    // Auth check
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user || user.user_metadata?.role !== 'admin') {
        redirect('/')
    }

    const supabase = await createServerSupabaseClient()

    // Fetch products, orders, and departments
    const [productsResult, ordersResult, departmentsResult] = await Promise.all([
        supabase.from('products').select('*, departments(name)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*'),
        supabase.from('departments').select('id, name'),
    ])

    const products = productsResult.data ?? []
    const orders = ordersResult.data ?? []
    const departments = departmentsResult.data ?? []

    // Simplified product list for restock dialog
    const productList = products.map(p => ({
        id: p.id,
        name: p.name,
        stock_quantity: p.stock_quantity ?? 0,
    }))

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-emerald-600 flex items-center gap-1 mb-4"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                            <Package className="h-7 w-7 text-emerald-600" />
                            Inventory Management
                        </h1>
                        <p className="text-muted-foreground mt-1">Monitor and manage your products.</p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <RestockDialog products={productList} />
                        <AddProductDialog departments={departments} />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards products={products} orders={orders} />

            {/* Inventory Table */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">All Products</h2>
                    <p className="text-sm text-muted-foreground">
                        {products.length} product{products.length !== 1 ? 's' : ''} total
                    </p>
                </div>
                <InventoryTable products={products} />
            </div>
        </div>
    )
}
