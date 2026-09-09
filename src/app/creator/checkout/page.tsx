'use client';

import { useState } from 'react';
import { useCart, CartItem } from '@/context/cart-context';
import ThreePreview from '@/components/three-preview';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ChevronRight, Share2, ShoppingBag, Box, Trash2, LayoutGrid, Rotate3d } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BOX_SIZES } from '@/app/creator/page';
import { handleCreateOrderSession } from '@/app/actions';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, updateQuantity, removeItem } = useCart();
    const [selectedItemIndex, setSelectedItemIdex] = useState(0);
    const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
    const [isOrdering, setIsOrdering] = useState(false);
    const { toast } = useToast();

    const activeItem = items[selectedItemIndex];

    const handleQuantityChange = (id: string, delta: number) => {
        const item = items.find(i => i.id === id);
        if (item) {
            updateQuantity(id, item.quantity + delta);
        }
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;
        
        setIsOrdering(true);
        try {
            // For MVP, we checkout the whole cart or the first item
            // Here we'll process the active item as a single checkout session
            const { sessionId, error } = await handleCreateOrderSession({
                designImageUrl: activeItem.imageUrl,
                designDescription: `${activeItem.description} (Size: ${activeItem.sizeLabel}) x${activeItem.quantity}`,
            });

            if (error) {
                toast({ title: 'Error', description: error, variant: 'destructive'});
                setIsOrdering(false);
                return;
            }

            if (sessionId) {
                const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
                await stripe!.redirectToCheckout({ sessionId });
            }
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive'});
            setIsOrdering(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                <h1 className="text-2xl font-bold font-headline mb-2">Your cart is empty</h1>
                <p className="text-muted-foreground mb-6">Go back to the editor to design your masterpiece.</p>
                <Link href="/creator">
                    <Button>Return to Editor</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 flex flex-col lg:flex-row h-full">
                {/* Left Section: Visual Preview */}
                <div className="flex-1 bg-[#F5F5F5] dark:bg-muted/10 p-4 md:p-8 flex flex-col gap-6 relative">
                    <div className="absolute top-6 left-6 z-10 flex gap-2">
                        <Button 
                            variant={viewMode === '3D' ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setViewMode('3D')}
                            className="rounded-full shadow-sm"
                        >
                            <Rotate3d className="h-4 w-4 mr-2" /> 3D View
                        </Button>
                        <Button 
                            variant={viewMode === '2D' ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setViewMode('2D')}
                            className="rounded-full shadow-sm"
                        >
                            <LayoutGrid className="h-4 w-4 mr-2" /> 2D Details
                        </Button>
                    </div>

                    <div className="flex-1 flex items-center justify-center min-h-[400px]">
                        {viewMode === '3D' ? (
                            <div className="w-full h-full max-w-2xl aspect-square">
                                <ThreePreview 
                                    key={`${activeItem.id}-${viewMode}`}
                                    imageUrl={activeItem.imageUrl}
                                    dimensions={activeItem.dimensions}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-square bg-card rounded-xl overflow-hidden border flex items-center justify-center group relative">
                                         <img 
                                            src={activeItem.imageUrl} 
                                            alt={`Angle ${i}`} 
                                            className={cn("w-full h-full object-cover", i === 2 && "rotate-90", i === 3 && "rotate-180", i === 4 && "-rotate-90")} 
                                         />
                                         <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Angle {i}
                                         </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thumbnails (Multi-item selector) */}
                    <div className="flex gap-4 overflow-x-auto pb-4 justify-center">
                        {items.map((item, idx) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItemIdex(idx)}
                                className={cn(
                                    "w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                                    selectedItemIndex === idx ? "border-primary ring-2 ring-primary/20 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <img src={item.imageUrl} alt={item.description} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Section: Configuration */}
                <div className="w-full lg:w-[480px] p-6 md:p-12 space-y-8 border-l bg-card overflow-y-auto">
                    <div className="space-y-2">
                        <nav className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-widest font-bold">
                            <span>Packaging</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-primary">Custom Box</span>
                        </nav>
                        <h1 className="text-4xl font-bold font-headline leading-tight">
                            Custom {activeItem.description}
                        </h1>
                        <p className="text-2xl font-bold text-primary font-headline">
                            ${(activeItem.price / 100).toFixed(2)}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Size:</label>
                        <div className="flex flex-wrap gap-2">
                            {BOX_SIZES.map((size) => (
                                <button
                                    key={size.id}
                                    className={cn(
                                        "w-12 h-12 rounded-md border-2 flex items-center justify-center text-sm font-bold transition-all",
                                        activeItem.sizeId === size.id 
                                            ? "bg-primary border-primary text-primary-foreground" 
                                            : "border-muted hover:border-primary/50"
                                    )}
                                    title={size.label}
                                >
                                    {size.shortLabel}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Quantity:</label>
                        <div className="flex items-center gap-4 w-32 bg-muted/50 rounded-lg p-1 border">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleQuantityChange(activeItem.id, -1)}
                                disabled={activeItem.quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="flex-1 text-center font-bold">{activeItem.quantity}</span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => handleQuantityChange(activeItem.id, 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase text-muted-foreground">Descriptions:</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Blending your unique creative vision with Boxmoc's premium manufacturing. This custom {activeItem.description} 
                            is designed to provide a premium unboxing experience. Built with durable {activeItem.dimensions.width > 8 ? 'heavy-duty' : 'lightweight'} 
                            materials and printed with high-resolution digital precision.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase text-muted-foreground">Benefits:</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                High-res full-bleed digital printing
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                Eco-friendly, recyclable materials
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                Custom-fit dimensions for your products
                            </li>
                        </ul>
                    </div>

                    <div className="pt-8">
                         <Button 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start px-0"
                            onClick={() => removeItem(activeItem.id)}
                         >
                            <Trash2 className="h-4 w-4 mr-2" /> Remove this design
                        </Button>
                    </div>
                </div>
            </main>

            {/* Bottom Sticky Action Bar */}
            <footer className="border-t bg-card p-4 md:p-6 sticky bottom-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:block">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Amount</p>
                        <p className="text-xl font-bold font-headline">${(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) / 100).toFixed(2)}</p>
                    </div>
                    <div className="flex-1 md:flex-none flex gap-2">
                        <Button 
                            onClick={handleCheckout} 
                            disabled={isOrdering}
                            className="flex-1 md:w-80 h-14 text-lg font-bold bg-black text-white hover:bg-black/90 rounded-none uppercase tracking-tighter"
                        >
                            {isOrdering ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Check Out'}
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-none border-2">
                            <ShoppingBag className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-none border-2">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={cn("animate-spin", props.className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
