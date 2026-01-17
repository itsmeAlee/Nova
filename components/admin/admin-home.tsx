'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import {
    TrendingUp,
    ShoppingCart,
    AlertTriangle,
    Package,
    Clock,
    ChevronRight,
} from 'lucide-react'
import { getDashboardStats, DashboardStats } from '@/app/admin/analytics'

export function AdminHome() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getDashboardStats()
                setStats(data)
            } catch (error) {
                console.error('Failed to load dashboard stats:', error)
            } finally {
                setLoading(false)
            }
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-slate-100 rounded-xl" />
                        ))}
                    </div>
                    <div className="h-80 bg-slate-100 rounded-xl" />
                </div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-red-500">Failed to load dashboard data.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Staff Dashboard</h1>
                    <p className="text-slate-500 text-sm">Welcome back! Here&apos;s your store overview.</p>
                </div>
                <Link
                    href="/admin"
                    className="text-sm font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                >
                    Manage Inventory
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* At a Glance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="card-fresh flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-900">
                            PKR {stats.totalRevenue.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Orders Today */}
                <div className="card-fresh flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Orders Today</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.ordersToday}</p>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className={`card-fresh flex items-center gap-4 ${stats.lowStockCount > 0 ? 'border-red-200 bg-red-50/50' : ''}`}>
                    <div className={`p-3 rounded-xl ${stats.lowStockCount > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                        <AlertTriangle className={`h-6 w-6 ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Low Stock Items</p>
                        <p className={`text-2xl font-bold ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                            {stats.lowStockCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="card-fresh mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue - Last 7 Days</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.recentSalesTrend}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                                formatter={(value) => [`PKR ${Number(value || 0).toLocaleString()}`, 'Revenue']}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Stock Table */}
                <div className="card-fresh">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Critical Stock
                        </h2>
                        <Link href="/admin" className="text-sm text-emerald-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    {stats.criticalStockItems.length === 0 ? (
                        <p className="text-slate-500 text-sm py-4 text-center">All products are well stocked!</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.criticalStockItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.department_name}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                                        {item.stock_quantity} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="card-fresh">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            Recent Orders
                        </h2>
                        <Link href="/admin" className="text-sm text-emerald-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    {stats.recentOrders.length === 0 ? (
                        <p className="text-slate-500 text-sm py-4 text-center">No orders yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">{order.customer_name || 'Guest'}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-emerald-600">
                                        PKR {order.total_amount?.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
