import Link from 'next/link'
import { Mountain, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FeaturedCollection() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1566804978007-06d289903b44?auto=format&fit=crop&w=1920&q=80')`,
                }}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/60" />

            {/* Content */}
            <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32">
                <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
                        <Mountain className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">New Collection</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        Treasures of the{' '}
                        <span className="text-emerald-400">North</span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                        Authentic Salajeet, Dry Fruits, and Handicrafts directly from
                        <span className="text-white font-medium"> Gilgit-Baltistan</span>.
                    </p>

                    {/* CTA Button */}
                    <Link href="/shop?category=Northern+Gifts">
                        <Button
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 text-base sm:text-lg font-medium rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 group"
                        >
                            Shop Northern Gifts
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            <span className="text-sm text-slate-400">100% Organic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            <span className="text-sm text-slate-400">Direct from Source</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            <span className="text-sm text-slate-400">Fast Shipping</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>
    )
}
