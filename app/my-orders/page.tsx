import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Calendar, ChevronRight, ShoppingBag } from 'lucide-react'

export default async function MyOrdersPage() {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Fetch Orders for this user by user_id
    const { data: orders } = await supabase
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
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
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        Looks like you haven&apos;t placed any orders with us yet. Start shopping to fill this page!
                    </p>
                    <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="card-fresh p-0 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Order Placed</p>
                                        <p className="text-sm text-slate-900 font-medium flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Amount</p>
                                        <p className="text-sm text-slate-900 font-medium">
                                            PKR {order.total_amount?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            Processing
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase">Order #</p>
                                    <p className="text-sm font-mono text-slate-700">{order.id.slice(0, 8)}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.order_items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                                <Image
                                                    src={item.products?.image_url || 'https://placehold.co/64x64?text=Product'}
                                                    alt={item.products?.name || 'Product'}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-slate-900 truncate">
                                                    {item.products?.name}
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    Qty: {item.quantity} × PKR {item.unit_price?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
