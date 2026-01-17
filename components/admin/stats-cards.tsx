import { DollarSign, PackageX, AlertTriangle } from 'lucide-react'
import { Tables } from '@/types/supabase'

type Product = Tables<'products'>
type Order = Tables<'orders'>

interface StatsCardsProps {
    products: Product[]
    orders: Order[]
}

export function StatsCards({ products, orders }: StatsCardsProps) {
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

    // Calculate low stock count (stock < 10)
    const lowStockCount = products.filter(
        (product) => (product.stock_quantity ?? 0) < 10
    ).length

    // Calculate expiring soon count (within 7 days)
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const expiringCount = products.filter((product) => {
        if (!product.expiry_date) return false
        const expiryDate = new Date(product.expiry_date)
        return expiryDate <= sevenDaysFromNow && expiryDate >= now
    }).length

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Revenue Card */}
            <div className="card-fresh flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                        PKR {totalRevenue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Low Stock Alert Card */}
            <div className="card-fresh flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-100">
                    <PackageX className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Low Stock Alert</p>
                    <p className="text-2xl font-bold text-orange-600">
                        {lowStockCount} {lowStockCount === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </div>

            {/* Expiring Soon Card */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <p className="text-sm text-red-600">Expiring Soon</p>
                    <p className="text-2xl font-bold text-red-700">
                        {expiringCount} {expiringCount === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </div>
        </div>
    )
}
