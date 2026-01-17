import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ClipboardList, ChevronLeft, Calendar, MapPin, User, Package } from 'lucide-react'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata?.role !== 'admin') {
        redirect('/')
    }

    // Fetch orders with profile data
    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            profiles:user_id (
                first_name,
                last_name
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        // JSON.stringify reveals the hidden error details
        console.error('Orders Fetch Error:', JSON.stringify(error, null, 2))
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
            case 'cancelled':
            case 'refunded':
                return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
            case 'processing':
            case 'shipped':
                return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
            default:
                return 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
        }
    }

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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                    <ClipboardList className="h-7 w-7 text-emerald-600" />
                    All Orders
                </h1>
                <p className="text-muted-foreground mt-1">
                    View and manage all customer orders.
                </p>
            </div>

            {/* Orders Table Card */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 overflow-hidden p-0">
                {!orders || orders.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-foreground mb-2">No orders yet</h2>
                        <p className="text-muted-foreground">
                            Orders will appear here when customers make purchases.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order ID</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Customer</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">City</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date/Time</th>
                                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Total</th>
                                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.map((order) => {
                                    // Handle profile data - could be object or array
                                    const profile = Array.isArray(order.profiles)
                                        ? order.profiles[0]
                                        : order.profiles

                                    const customerName = profile?.first_name && profile?.last_name
                                        ? `${profile.first_name} ${profile.last_name}`
                                        : order.customer_name || 'Guest'

                                    const city = order.city || 'N/A'
                                    const orderId = typeof order.id === 'string'
                                        ? `#...${order.id.slice(-4)}`
                                        : `#${order.id}`

                                    return (
                                        <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">
                                                    {orderId}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center shrink-0">
                                                        <User className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                    <span className="font-medium text-foreground truncate max-w-[150px]">
                                                        {customerName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{city}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{formatDate(order.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-semibold text-emerald-600">
                                                    PKR {(order.total_amount ?? 0).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Footer */}
            {orders && orders.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground text-center">
                    Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    )
}
