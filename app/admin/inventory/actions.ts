'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

interface ActionState {
    success: boolean
    message: string
}

// ============================================
// CREATE PRODUCT
// ============================================
export async function createProduct(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    try {
        const supabase = await createClient()

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || user.user_metadata?.role !== 'admin') {
            return { success: false, message: 'Unauthorized. Admin access required.' }
        }

        // Extract form data
        const name = formData.get('name') as string
        const priceStr = formData.get('price') as string
        const stockStr = formData.get('stock') as string
        const imageUrl = formData.get('image_url') as string
        const departmentId = formData.get('department_id') as string

        // Validate required fields
        if (!name || !priceStr || !stockStr) {
            return { success: false, message: 'Name, price, and stock are required.' }
        }

        const price = parseFloat(priceStr)
        const stock = parseInt(stockStr, 10)

        if (isNaN(price) || price < 0) {
            return { success: false, message: 'Please enter a valid price.' }
        }

        if (isNaN(stock) || stock < 0) {
            return { success: false, message: 'Please enter a valid stock quantity.' }
        }

        // Insert product
        const { error } = await supabase
            .from('products')
            .insert({
                name,
                price,
                stock_quantity: stock,
                image_url: imageUrl || 'https://placehold.co/400x400?text=Product',
                department_id: departmentId ? parseInt(departmentId) : null,
            })

        if (error) {
            console.error('Product creation error:', error)
            return { success: false, message: 'Failed to create product. Please try again.' }
        }

        // CRITICAL: Purge cache AFTER db write is confirmed
        revalidatePath('/admin', 'page')
        revalidatePath('/shop', 'page')
        revalidatePath('/', 'page')

        return { success: true, message: `Product "${name}" created successfully!` }
    } catch (error) {
        console.error('Product creation error:', error)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}

// ============================================
// RESTOCK PRODUCT (Using RPC for Atomic Update)
// ============================================
export async function restockProduct(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    try {
        const supabase = await createClient()

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || user.user_metadata?.role !== 'admin') {
            return { success: false, message: 'Unauthorized. Admin access required.' }
        }

        // Extract form data
        const productId = formData.get('product_id') as string
        const quantityStr = formData.get('quantity') as string

        // Validate
        if (!productId || !quantityStr) {
            return { success: false, message: 'Product and quantity are required.' }
        }

        const addedQuantity = parseInt(quantityStr, 10)

        if (isNaN(addedQuantity) || addedQuantity <= 0) {
            return { success: false, message: 'Please enter a valid quantity greater than 0.' }
        }

        // Get product name for success message
        const { data: product } = await supabase
            .from('products')
            .select('name, stock_quantity')
            .eq('id', productId)
            .single()

        if (!product) {
            return { success: false, message: 'Product not found.' }
        }

        // Call the RPC function for atomic update
        const { error } = await supabase.rpc('increment_stock', {
            p_id: parseInt(productId),
            qty: addedQuantity
        })

        if (error) {
            console.error('Restock RPC Error:', JSON.stringify(error, null, 2))
            return { success: false, message: 'Failed to update stock. Please try again.' }
        }

        const newStock = (product.stock_quantity || 0) + addedQuantity

        // CRITICAL: Purge cache AFTER db write is confirmed
        revalidatePath('/admin', 'page')
        revalidatePath('/shop', 'page')
        revalidatePath('/', 'page')

        return {
            success: true,
            message: `Added ${addedQuantity} units to "${product.name}". New stock: ${newStock}`
        }
    } catch (error) {
        console.error('Restock error:', error)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}

// ============================================
// DELETE PRODUCT
// ============================================
export async function deleteProduct(productId: number): Promise<ActionState> {
    try {
        const supabase = await createClient()

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || user.user_metadata?.role !== 'admin') {
            return { success: false, message: 'Unauthorized. Admin access required.' }
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)

        if (error) {
            console.error('Product deletion error:', error)
            return { success: false, message: 'Failed to delete product.' }
        }

        // CRITICAL: Purge cache AFTER delete is confirmed
        revalidatePath('/admin', 'page')
        revalidatePath('/shop', 'page')
        revalidatePath('/', 'page')

        return { success: true, message: 'Product deleted successfully.' }
    } catch (error) {
        console.error('Product deletion error:', error)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}
