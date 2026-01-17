import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Calendar, ShoppingBag } from 'lucide-react'

export default async function MyOrdersPage() {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Fetch Orders for this user by user_id
    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                id,
                quantity,
                unit_price,
                products (
                    name,
                    image_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Error logging for debugging
    if (error) {
        console.error('Supabase Fetch Error:', error)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Package className="h-6 w-6 text-emerald-600" />
                    My Order History
                </h1>
                <Link
                    href="/shop"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Continue Shopping
                </Link>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="card-fresh text-center py-16">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-10 w-10 text-emerald-300" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                        Looks like you haven&apos;t placed any orders with us yet. Start shopping to fill this page!
                    </p>
                    <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        // Defensive check for order_items
                        const orderItems = Array.isArray(order.order_items) ? order.order_items : []

                        return (
                            <div key={order.id} className="card-fresh p-0 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Order Header */}
                                <div className="bg-muted/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Order Placed</p>
                                            <p className="text-sm text-foreground font-medium flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Amount</p>
                                            <p className="text-sm text-foreground font-medium">
                                                PKR {(order.total_amount ?? 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${order.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase">Order #</p>
                                        <p className="text-sm font-mono text-muted-foreground">
                                            {typeof order.id === 'string' ? order.id.slice(0, 8) : order.id}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    {orderItems.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">No items found for this order.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {orderItems.map((item: any) => {
                                                // Defensive: Handle if products is an array or object
                                                const product = Array.isArray(item.products)
                                                    ? item.products[0]
                                                    : item.products

                                                // Safe fallbacks for missing product data
                                                const productName = product?.name || 'Unknown Item'
                                                const productImg = product?.image_url || 'https://placehold.co/64x64?text=Item'
                                                const price = item.unit_price ?? 0
                                                const quantity = item.quantity ?? 1

                                                return (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden shrink-0 border border-border">
                                                            <Image
                                                                src={productImg}
                                                                alt={productName}
                                                                width={64}
                                                                height={64}
                                                                className="object-cover w-full h-full"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-foreground truncate">
                                                                {productName}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Qty: {quantity} × PKR {price.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-foreground">
                                                                PKR {(price * quantity).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
