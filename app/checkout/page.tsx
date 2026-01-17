'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, ChevronLeft, Plus } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { placeOrder } from '@/app/actions'
import { AddToCartControl } from '@/components/shop/add-to-cart-control'

const initialState = { success: false, message: '' }

export default function CheckoutPage() {
    const router = useRouter()
    const { items, clearCart, total } = useCart()
    const [state, formAction, isPending] = useActionState(placeOrder, initialState)

    // Clear cart on successful order
    useEffect(() => {
        if (state?.success) {
            clearCart()
        }
    }, [state?.success, clearCart])

    const handleContinueShopping = () => {
        router.push('/shop')
    }

    // Empty cart view
    if (items.length === 0 && !state?.success) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="card-fresh max-w-md mx-auto text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
                    <p className="text-slate-500 mb-6">Add some products to get started!</p>
                    <button
                        type="button"
                        onClick={() => window.location.href = '/shop'}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    // Success view
    if (state?.success) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center space-y-4 p-8 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex justify-center">
                        <div className="p-3 bg-emerald-100 rounded-full">
                            <span className="text-4xl">🎉</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-800">Order Placed Successfully!</h2>
                    <p className="text-slate-600">{state.message}</p>

                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={() => window.location.href = '/shop'}
                            className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-md transition-all hover:scale-105 text-lg cursor-pointer"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-600 mb-6 transition-colors"
            >
                <ChevronLeft className="h-5 w-5" />
                Back to Shop
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

            <form action={formAction}>
                {/* Hidden cart data */}
                <input type="hidden" name="cart" value={JSON.stringify(items)} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Shipping Details */}
                    <div className="card-fresh">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="ali@example.com"
                                    className="input-fresh w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="customer_name" className="block text-sm font-medium text-slate-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="customer_name"
                                    name="customer_name"
                                    required
                                    placeholder="Ali Hassan"
                                    className="input-fresh w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    placeholder="0300-1234567"
                                    className="input-fresh w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="shipping_address" className="block text-sm font-medium text-slate-700 mb-1">
                                    Delivery Address *
                                </label>
                                <textarea
                                    id="shipping_address"
                                    name="shipping_address"
                                    required
                                    rows={3}
                                    placeholder="House #123, Street 4, Block B, DHA Phase 5"
                                    className="input-fresh w-full resize-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                                    City *
                                </label>
                                <select id="city" name="city" required className="input-fresh w-full">
                                    <option value="">Select City</option>
                                    <option value="Lahore">Lahore</option>
                                    <option value="Karachi">Karachi</option>
                                    <option value="Islamabad">Islamabad</option>
                                    <option value="Rawalpindi">Rawalpindi</option>
                                    <option value="Faisalabad">Faisalabad</option>
                                    <option value="Multan">Multan</option>
                                    <option value="Peshawar">Peshawar</option>
                                    <option value="Quetta">Quetta</option>
                                </select>
                            </div>
                        </div>

                        {/* Error Message */}
                        {state?.message && !state.success && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {state.message}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="card-fresh h-fit lg:sticky lg:top-24">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                        <Image
                                            src={item.product.image_url || 'https://placehold.co/64x64?text=P'}
                                            alt={item.product.name || 'Product'}
                                            width={64}
                                            height={64}
                                            unoptimized
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-slate-900 truncate text-sm">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-sm text-emerald-600 font-medium">
                                            PKR {(item.product.price ?? 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <AddToCartControl product={item.product} variant="compact" />
                                </div>
                            ))}
                        </div>

                        {/* Add More Items Link */}
                        <Link
                            href="/shop"
                            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 rounded-lg transition-colors mb-4"
                        >
                            <Plus className="h-4 w-4" />
                            Forgot something? Add more items
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-slate-200 my-4" />

                        {/* Total */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-lg font-medium text-slate-600">Total</span>
                            <span className="text-2xl font-bold text-emerald-600">
                                PKR {total.toLocaleString()}
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="h-5 w-5" />
                                    Place Order
                                </>
                            )}
                        </button>

                        <p className="text-xs text-slate-400 text-center mt-4">
                            Payment Method: Cash on Delivery (COD)
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
