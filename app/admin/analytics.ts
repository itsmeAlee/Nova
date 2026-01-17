'use server'

import { createClient } from '@/utils/supabase/server'

export interface DashboardStats {
    totalRevenue: number
    ordersToday: number
    lowStockCount: number
    criticalStockItems: Array<{
        id: string
        name: string
        stock_quantity: number
        department_name: string
    }>
    recentSalesTrend: Array<{
        date: string
        revenue: number
    }>
    recentOrders: Array<{
        id: string
        customer_name: string
        total_amount: number
        created_at: string
    }>
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient()

    // 1. Total Revenue
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

    // 4. Critical Stock Items (< 5)
    const { data: criticalStockItems } = await supabase
        .from('products')
        .select('id, name, stock_quantity, departments(name)')
        .lt('stock_quantity', 5)
        .order('stock_quantity', { ascending: true })
        .limit(10)

    // 5. Recent Sales Trend (Last 7 Days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentOrders } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

    // Group by date
    const dailyRevenue: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        dailyRevenue[dateStr] = 0
    }

    recentOrders?.forEach((order) => {
        const dateStr = new Date(order.created_at).toISOString().split('T')[0]
        if (dailyRevenue[dateStr] !== undefined) {
            dailyRevenue[dateStr] += order.total_amount || 0
        }
    })

    const recentSalesTrend = Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue,
    }))

    // 6. Recent Orders List
    const { data: latestOrders } = await supabase
        .from('orders')
        .select('id, customer_name, total_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        totalRevenue,
        ordersToday: ordersToday || 0,
        lowStockCount: lowStockCount || 0,
        criticalStockItems: (criticalStockItems || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            stock_quantity: item.stock_quantity,
            department_name: item.departments?.name || 'Unknown',
        })),
        recentSalesTrend,
        recentOrders: latestOrders || [],
    }
}
