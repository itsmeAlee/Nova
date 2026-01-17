'use server'

import { createClient } from '@/utils/supabase/server'

export type TimeRange = '24h' | '7d' | '30d' | '90d'

export interface DashboardStats {
    totalRevenue: number
    ordersToday: number
    lowStockCount: number
    totalProducts: number
    criticalStockItems: Array<{
        id: string
        name: string
        stock_quantity: number
        department_name: string
    }>
    salesTrend: Array<{
        label: string
        revenue: number
    }>
    recentOrders: Array<{
        id: string
        customer_name: string
        total_amount: number
        created_at: string
        status: string
    }>
}

function getDateRangeStart(range: TimeRange): Date {
    const now = new Date()
    switch (range) {
        case '24h':
            return new Date(now.getTime() - 24 * 60 * 60 * 1000)
        case '7d':
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case '30d':
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case '90d':
            return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        default:
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
}

function formatDateLabel(date: Date, range: TimeRange): string {
    switch (range) {
        case '24h':
            return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }) + ':00'
        case '7d':
        case '30d':
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        case '90d':
            return 'W' + Math.ceil(date.getDate() / 7) + ' ' + date.toLocaleDateString('en-US', { month: 'short' })
        default:
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
}

function generateEmptyBuckets(range: TimeRange): Map<string, number> {
    const buckets = new Map<string, number>()
    const now = new Date()

    switch (range) {
        case '24h':
            for (let i = 23; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 60 * 60 * 1000)
                buckets.set(formatDateLabel(d, range), 0)
            }
            break
        case '7d':
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
                buckets.set(formatDateLabel(d, range), 0)
            }
            break
        case '30d':
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
                buckets.set(formatDateLabel(d, range), 0)
            }
            break
        case '90d':
            for (let i = 12; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
                buckets.set(formatDateLabel(d, range), 0)
            }
            break
    }

    return buckets
}

export async function getDashboardStats(range: TimeRange = '7d'): Promise<DashboardStats> {
    const supabase = await createClient()
    const rangeStart = getDateRangeStart(range)

    // 1. Total Revenue (all time)
    const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    // 2. Orders Today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: ordersToday } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

    // 3. Low Stock Count (< 10)
    const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock_quantity', 10)

    // 4. Total Products
    const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // 5. Critical Stock Items (< 5)
    const { data: criticalStockItems } = await supabase
        .from('products')
        .select('id, name, stock_quantity, departments(name)')
        .lt('stock_quantity', 5)
        .order('stock_quantity', { ascending: true })
        .limit(5)

    // 6. Sales Trend for selected range
    const { data: rangeOrders } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', rangeStart.toISOString())
        .order('created_at', { ascending: true })

    // Group orders into buckets
    const buckets = generateEmptyBuckets(range)

    rangeOrders?.forEach((order) => {
        const orderDate = new Date(order.created_at)
        const label = formatDateLabel(orderDate, range)
        if (buckets.has(label)) {
            buckets.set(label, (buckets.get(label) || 0) + (order.total_amount || 0))
        }
    })

    const salesTrend = Array.from(buckets.entries()).map(([label, revenue]) => ({
        label,
        revenue,
    }))

    // 7. Recent Orders List
    const { data: latestOrders } = await supabase
        .from('orders')
        .select('id, customer_name, total_amount, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        totalRevenue,
        ordersToday: ordersToday || 0,
        lowStockCount: lowStockCount || 0,
        totalProducts: totalProducts || 0,
        criticalStockItems: (criticalStockItems || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            stock_quantity: item.stock_quantity,
            department_name: item.departments?.name || 'Unknown',
        })),
        salesTrend,
        recentOrders: (latestOrders || []).map((order: any) => ({
            id: order.id,
            customer_name: order.customer_name || 'Guest',
            total_amount: order.total_amount || 0,
            created_at: order.created_at,
            status: order.status || 'processing',
        })),
    }
}
