'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Loader2, CheckCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { restockProduct } from '@/app/admin/inventory/actions'

interface Product {
    id: number
    name: string | null
    stock_quantity: number
}

interface RestockDialogProps {
    products: Product[]
}

export function RestockDialog({ products }: RestockDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<string>('')
    const [state, formAction, isPending] = useActionState(restockProduct, null)
    const hasRefreshed = useRef(false)

    // Handle success: close dialog and force router refresh
    useEffect(() => {
        if (state?.success && !hasRefreshed.current) {
            hasRefreshed.current = true

            // Short delay to show success message, then close and refresh
            const timer = setTimeout(() => {
                setOpen(false)
                setSelectedProduct('')

                // THE MAGIC LINE: Force fetch new data from server
                router.refresh()

                // Reset the ref after dialog closes
                hasRefreshed.current = false
            }, 1200)

            return () => clearTimeout(timer)
        }
    }, [state, router])

    // Reset ref when dialog closes
    useEffect(() => {
        if (!open) {
            hasRefreshed.current = false
        }
    }, [open])

    // Find selected product for preview
    const product = products.find(p => p.id.toString() === selectedProduct)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Restock Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-emerald-600" />
                        Restock Inventory
                    </DialogTitle>
                    <DialogDescription>
                        Add stock to an existing product.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {/* Product Select */}
                    <div className="space-y-2">
                        <Label htmlFor="product">Select Product *</Label>
                        <input type="hidden" name="product_id" value={selectedProduct} />
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a product to restock" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((prod) => (
                                    <SelectItem key={prod.id} value={prod.id.toString()}>
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <span className="truncate">{prod.name || 'Unnamed Product'}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${prod.stock_quantity < 5
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                                : prod.stock_quantity < 10
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                }`}>
                                                {prod.stock_quantity} in stock
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Current Stock Preview */}
                    {product && (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Current Stock</p>
                            <p className="text-2xl font-bold text-foreground">{product.stock_quantity} units</p>
                        </div>
                    )}

                    {/* Quantity to Add */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity to Add *</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            placeholder="e.g., 50"
                            required
                            className="text-lg"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter the number of units received from supplier.
                        </p>
                    </div>

                    {/* Status Message */}
                    {state?.message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${state.success
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                            }`}>
                            {state.success && <CheckCircle className="h-4 w-4" />}
                            {state.message}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !selectedProduct}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Stock
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
