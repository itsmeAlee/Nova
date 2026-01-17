'use client'

import { useEffect, useState, useTransition } from 'react'
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
    Boxes,
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getDashboardStats, DashboardStats, TimeRange } from '@/app/admin/analytics'

interface DashboardViewProps {
    initialStats: DashboardStats
}

export function DashboardView({ initialStats }: DashboardViewProps) {
    const [stats, setStats] = useState<DashboardStats>(initialStats)
    const [range, setRange] = useState<TimeRange>('7d')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const newStats = await getDashboardStats(range)
            setStats(newStats)
        })
    }, [range])

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back! Here&apos;s your store overview.</p>
                </div>
                <Link
                    href="/admin"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                    Manage Inventory
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Revenue */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl shrink-0">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">
                            PKR {stats.totalRevenue.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Orders Today */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl shrink-0">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Orders Today</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.ordersToday}</p>
                    </div>
                </div>

                {/* Low Stock */}
                <div className={`card-fresh dark:bg-slate-800 dark:border-slate-700 flex items-center gap-4 ${stats.lowStockCount > 0 ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20' : ''}`}>
                    <div className={`p-3 rounded-xl shrink-0 ${stats.lowStockCount > 0 ? 'bg-red-100 dark:bg-red-900/50' : 'bg-slate-100 dark:bg-slate-700'}`}>
                        <AlertTriangle className={`h-6 w-6 ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock</p>
                        <p className={`text-xl font-bold ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                            {stats.lowStockCount}
                        </p>
                    </div>
                </div>

                {/* Total Products */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl shrink-0">
                        <Boxes className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Products</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue</h2>
                    <Select value={range} onValueChange={(v) => setRange(v as TimeRange)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className={`h-[300px] w-full min-w-0 ${isPending ? 'opacity-50' : ''}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                                width={45}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--tooltip-bg, #fff)',
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

            {/* Bottom Grid - Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Stock Table */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Critical Stock
                        </h2>
                        <Link href="/admin" className="text-sm text-emerald-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    {stats.criticalStockItems.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">All products are well stocked!</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.criticalStockItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.department_name}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-bold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full shrink-0 ml-2">
                                        {item.stock_quantity} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            Recent Orders
                        </h2>
                        <Link href="/admin" className="text-sm text-emerald-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    {stats.recentOrders.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">No orders yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white truncate">{order.customer_name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                        <span className="font-semibold text-emerald-600">
                                            PKR {order.total_amount.toLocaleString()}
                                        </span>
                                        <p className={`text-xs capitalize ${order.status === 'completed' ? 'text-green-600' :
                                                order.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                                            }`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
