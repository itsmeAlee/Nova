'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase'

interface CartItem {
    product: {
        id: number
        name: string | null
        price: number | null
    }
    quantity: number
}

interface PlaceOrderState {
    success: boolean
    message: string
    orderId?: number
}

export async function placeOrder(
    prevState: PlaceOrderState | null,
    formData: FormData
): Promise<PlaceOrderState> {
    try {
        const supabase = await createServerSupabaseClient()

        // Log all form data for debugging
        console.log('=== CHECKOUT FORM DATA ===')
        console.log(Object.fromEntries(formData))
        console.log('==========================')

        // Extract form data with EXACT field names
        const email = formData.get('email') as string
        const customer_name = formData.get('customer_name') as string
        const shipping_address = formData.get('shipping_address') as string
        const city = formData.get('city') as string
        const phone = formData.get('phone') as string
        const cartJson = formData.get('cart') as string

        // Validate required fields
        if (!customer_name || !email || !shipping_address || !city || !phone) {
            return { success: false, message: 'Please fill in all required fields.' }
        }

        // Parse cart items
        let cartItems: CartItem[]
        try {
            cartItems = JSON.parse(cartJson)
        } catch {
            return { success: false, message: 'Invalid cart data.' }
        }

        if (!cartItems || cartItems.length === 0) {
            return { success: false, message: 'Your cart is empty.' }
        }

        // Calculate total
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
            0
        )

        // Create order with EXACT database column names
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_name: customer_name,
                email: email,
                shipping_address: shipping_address,
                city: city,
                phone: phone,
                total_amount: totalAmount,
                status: 'completed',
                payment_method: 'COD',
            })
            .select('id')
            .single()

        if (orderError || !order) {
            console.error('Order creation error:', orderError)
            return { success: false, message: 'Failed to create order. Please try again.' }
        }

        console.log('Order created:', order)

        // Create order items
        const orderItems = cartItems.map((item) => ({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.price ?? 0,
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            console.error('Order items error:', itemsError)
            return { success: false, message: 'Failed to add order items. Please try again.' }
        }

        console.log('Order items created:', orderItems)

        // Revalidate paths to update dashboard and shop
        revalidatePath('/admin')
        revalidatePath('/shop')
        revalidatePath('/')

        return {
            success: true,
            message: `Order #${order.id} placed successfully! Thank you for shopping with FastTrack.`,
            orderId: order.id
        }
    } catch (error) {
        console.error('Checkout error:', error)
        return { success: false, message: 'An unexpected error occurred. Please try again.' }
    }
}
