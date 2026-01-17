import { Tables } from '@/types/supabase'

type Product = Tables<'products'>

interface InventoryTableProps {
    products: Product[]
}

export function InventoryTable({ products }: InventoryTableProps) {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const isExpiringSoon = (expiryDate: string | null) => {
        if (!expiryDate) return false
        const date = new Date(expiryDate)
        return date <= sevenDaysFromNow && date >= now
    }

    const isLowStock = (quantity: number | null) => {
        return (quantity ?? 0) < 10
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <div className="card-fresh overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Name</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Department</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Price</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Stock</th>
                            <th className="px-4 py-3 text-sm font-semibold text-slate-600">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className={`border-b border-slate-100 transition-colors ${isExpiringSoon(product.expiry_date)
                                    ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500'
                                    : 'hover:bg-slate-50'
                                    }`}
                            >
                                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                    {product.name || 'Unnamed Product'}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-500">
                                    {product.department_id ? `Dept ${product.department_id}` : '—'}
                                </td>
                                <td className="px-4 py-3 text-sm price-tag">
                                    PKR {(product.price ?? 0).toLocaleString()}
                                </td>
                                <td className={`px-4 py-3 text-sm ${isLowStock(product.stock_quantity)
                                    ? 'text-orange-600 font-bold'
                                    : 'text-emerald-600'
                                    }`}>
                                    {product.stock_quantity ?? 0}
                                </td>
                                <td className={`px-4 py-3 text-sm ${isExpiringSoon(product.expiry_date)
                                    ? 'text-red-700 font-medium'
                                    : 'text-slate-500'
                                    }`}>
                                    {formatDate(product.expiry_date)}
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
