'use client'

import { useState, useTransition } from 'react'
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
    Clock,
    ChevronRight,
    Boxes,
    Loader2,
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { StatsCard } from '@/components/admin/stats-card'
import { getDashboardStats, DashboardStats, TimeRange } from '@/app/admin/analytics'

interface DashboardViewProps {
    initialStats: DashboardStats
}

export function DashboardView({ initialStats }: DashboardViewProps) {
    const [stats, setStats] = useState<DashboardStats>(initialStats)
    const [range, setRange] = useState<TimeRange>('7d')
    const [isPending, startTransition] = useTransition()

    // Optimized filter change handler
    const handleFilterChange = (newRange: string) => {
        setRange(newRange as TimeRange)
        startTransition(async () => {
            const newStats = await getDashboardStats(newRange as TimeRange)
            setStats(newStats)
        })
    }

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Staff Dashboard</h1>
                    <p className="text-muted-foreground text-sm">Welcome back! Here&apos;s your store overview.</p>
                </div>
                <Link
                    href="/admin"
                    className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
                >
                    Manage Inventory
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Stats Cards - Responsive Grid with Click-to-Expand */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {/* Total Revenue */}
                <StatsCard
                    title="Total Revenue"
                    value={`PKR ${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 dark:text-emerald-400" />}
                    iconBgColor="bg-emerald-100 dark:bg-emerald-900/50"
                />

                {/* Orders Today */}
                <StatsCard
                    title="Orders Today"
                    value={stats.ordersToday.toString()}
                    icon={<ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" />}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/50"
                />

                {/* Low Stock */}
                <StatsCard
                    title="Low Stock Items"
                    value={stats.lowStockCount.toString()}
                    icon={<AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 ${stats.lowStockCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-slate-400'}`} />}
                    iconBgColor={stats.lowStockCount > 0 ? 'bg-red-100 dark:bg-red-900/50' : 'bg-slate-100 dark:bg-slate-700'}
                    alert={stats.lowStockCount > 0}
                    alertColor="red"
                    trend={stats.lowStockCount > 0 ? 'Items need restocking!' : 'All items well stocked'}
                />

                {/* Total Products */}
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts.toString()}
                    icon={<Boxes className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 dark:text-purple-400" />}
                    iconBgColor="bg-purple-100 dark:bg-purple-900/50"
                />
            </div>

            {/* Revenue Chart */}
            <div className="card-fresh dark:bg-slate-800 dark:border-slate-700 mb-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 pb-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-foreground">Revenue</h2>
                        {isPending && (
                            <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                <span className="hidden sm:inline">Updating...</span>
                            </div>
                        )}
                    </div>
                    <Select value={range} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1h">Last Hour</SelectItem>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Chart Container - Fixed height, min-w-0 prevents overflow */}
                <div className={`h-[250px] sm:h-[300px] w-full min-w-0 p-4 pt-2 transition-opacity duration-200 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.salesTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                                strokeOpacity={0.15}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="label"
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                                width={35}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    borderColor: '#374151',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                                    fontSize: '12px',
                                }}
                                labelStyle={{ color: '#F3F4F6', fontWeight: 600, marginBottom: 4 }}
                                itemStyle={{ color: '#10b981' }}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Critical Stock Table */}
                <div className="card-fresh dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 dark:text-red-400" />
                            Critical Stock
                        </h2>
                        <Link href="/admin" className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                            View All
                        </Link>
                    </div>
                    {stats.criticalStockItems.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-4 text-center">All products are well stocked!</p>
                    ) : (
                        <div className="space-y-1 overflow-x-auto">
                            {stats.criticalStockItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 sm:py-3 border-b border-border last:border-0"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-foreground truncate text-sm sm:text-base">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.department_name}</p>
                                    </div>
                                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-bold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full shrink-0 ml-2">
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
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400" />
                            Recent Orders
                        </h2>
                        <Link href="/admin/orders" className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                            View All
                        </Link>
                    </div>
                    {stats.recentOrders.length === 0 ? (
                        <p className="text-muted-foreground text-sm py-4 text-center">No orders yet.</p>
                    ) : (
                        <div className="space-y-1 overflow-x-auto">
                            {stats.recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between py-2 sm:py-3 border-b border-border last:border-0"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-foreground truncate text-sm sm:text-base">{order.customer_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                        <span className="font-semibold text-emerald-500 dark:text-emerald-400 text-sm sm:text-base">
                                            PKR {order.total_amount.toLocaleString()}
                                        </span>
                                        <p className={`text-xs font-medium capitalize ${order.status === 'completed' ? 'text-green-500 dark:text-green-400' :
                                            order.status === 'cancelled' ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400'
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
