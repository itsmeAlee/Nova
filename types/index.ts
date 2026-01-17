// Product Types
export interface Product {
    id: number
    name: string | null
    description?: string | null
    department_id?: number | null
    price: number
    stock_quantity: number
    expiry_date?: string | null
    image_url?: string | null
    category?: string | null
    created_at?: string
    departments?: {
        name: string
    } | null
}

// Order Types
export interface Order {
    id: string
    user_id?: string | null
    customer_name?: string | null
    total_amount: number
    status: string
    city?: string | null
    created_at: string
}

// Order Item Types
export interface OrderItem {
    id: number
    order_id: string
    product_id: number
    quantity: number
    unit_price: number
    product?: Product
}

// Department Types
export interface Department {
    id: number
    name: string
}

// Profile Types
export interface Profile {
    id: string
    username?: string | null
    first_name?: string | null
    last_name?: string | null
    role?: string
    created_at?: string
}
