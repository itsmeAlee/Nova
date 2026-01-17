'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, CheckCircle, Package, Hash, Image as ImageIcon } from 'lucide-react'
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
import { createProduct } from '@/app/admin/inventory/actions'

interface Department {
    id: number
    name: string
}

interface AddProductDialogProps {
    departments: Department[]
}

export function AddProductDialog({ departments }: AddProductDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState<string>('')
    const [state, formAction, isPending] = useActionState(createProduct, null)
    const hasRefreshed = useRef(false)

    // Handle success: close dialog and force router refresh
    useEffect(() => {
        if (state?.success && !hasRefreshed.current) {
            hasRefreshed.current = true

            const timer = setTimeout(() => {
                setOpen(false)
                setSelectedDepartment('')

                // THE MAGIC LINE: Force fetch new data from server
                router.refresh()

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-emerald-600" />
                        Add New Product
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new product to your inventory.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Organic Milk 1L"
                                required
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Price and Stock Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (PKR) *</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                    Rs.
                                </span>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="299.00"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Initial Stock *</Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    placeholder="100"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Department Select */}
                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <input type="hidden" name="department_id" value={selectedDepartment} />
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a department (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="image_url"
                                name="image_url"
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                className="pl-10"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Leave empty for a default placeholder image.
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
                            disabled={isPending}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Product
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
