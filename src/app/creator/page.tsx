'use client';

import { useState, useEffect, useActionState } from 'react';
import ThreePreview from '@/components/three-preview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Brush, Share2, Type, Save, Sparkles, Box, ShoppingCart, Settings2, Image as ImageIcon, Send, Loader2, Menu, Info, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';
import { getUserAssets, handleUploadDesignImage, type Asset, handleGenerateDesign } from '@/app/actions';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export const BOX_SIZES = [
    { id: 'small-cube', label: 'Small Cube (4"x4"x4")', width: 4, height: 4, depth: 4, shortLabel: 'S', price: 1.45 },
    { id: 'medium-cube', label: 'Medium Cube (8"x8"x8")', width: 8, height: 8, depth: 8, shortLabel: 'M', price: 2.82 },
    { id: 'large-cube', label: 'Large Cube (12"x12"x12")', width: 12, height: 12, depth: 12, shortLabel: 'L', price: 4.15 },
    { id: 'small-mailer', label: 'Small Mailer (6"x6"x2")', width: 6, height: 2, depth: 6, shortLabel: 'XL', price: 1.95 },
    { id: 'medium-mailer', label: 'Medium Mailer (10"x8"x2")', width: 10, height: 2, depth: 8, shortLabel: 'XXL', price: 3.25 },
    { id: 'large-mailer', label: 'Large Mailer (12.5"x9.5"x4")', width: 12.5, height: 4, depth: 9.5, shortLabel: '3XL', price: 5.50 },
];

export const PRODUCT_TIERS = [
    { 
        id: 'shipper', 
        name: 'The Custom Shipper', 
        tier: 'Tier 1',
        material: 'Cardboard',
        target: 'E-commerce startups',
        angle: 'Low minimums, fast shipping, and sharp branding.',
        multiplier: 1.0,
        minQty: 10
    },
    { 
        id: 'retailer', 
        name: 'The Elegant Retailer', 
        tier: 'Tier 2',
        material: 'Thick Paper',
        target: 'Boutiques & Bakeries',
        angle: 'Crisp, clean, minimalist luxury. Custom-cut for premium presentations.',
        multiplier: 2.5,
        minQty: 5
    },
    { 
        id: 'keepsake', 
        name: 'The Bespoke Keepsake', 
        tier: 'Tier 3',
        material: '100% 3D Printed',
        target: 'Ultra-high-end gifts & VIPs',
        angle: 'Solid, indestructible piece of art that lives on your client\'s desk forever.',
        multiplier: 15.0,
        minQty: 1
    }
];

export default function CreatorPage() {
  const [design, setDesign] = useState<{ imageUrl?: string; description?: string }>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState('medium-cube');
  const [selectedTierId, setSelectedTierId] = useState('shipper');
  const [quantity, setQuantity] = useState(150);
  const [isUploading, setIsUploading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const { toast } = useToast();
  const { addItem } = useCart();
  const router = useRouter();

  const currentSize = BOX_SIZES.find(s => s.id === selectedSizeId) || BOX_SIZES[1];
  const currentTier = PRODUCT_TIERS.find(t => t.id === selectedTierId) || PRODUCT_TIERS[0];
  
  const unitPrice = currentSize.price * currentTier.multiplier;

  const [generateState, generateAction, isGenerating] = useActionState(handleGenerateDesign, { message: '' });

  useEffect(() => {
    if (generateState.success && generateState.design) {
      setDesign({ 
        imageUrl: generateState.design.imageUrl, 
        description: generateState.design.designDescription 
      });
      setAiInput('');
      fetchAssets();
    } else if (generateState.message && !generateState.success) {
      toast({ title: 'AI Generation Failed', description: generateState.message, variant: 'destructive' });
    }
  }, [generateState, toast]);

  const fetchAssets = async () => {
    const data = await getUserAssets();
    setAssets(data);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
      // Ensure quantity respects MOQ when tier changes
      if (quantity < currentTier.minQty) {
          setQuantity(currentTier.minQty);
      }
  }, [selectedTierId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const result = await handleUploadDesignImage(formData);
      if (result.success && result.imageUrl) {
        setDesign({ imageUrl: result.imageUrl, description: 'Custom uploaded design' });
        fetchAssets();
        toast({ title: 'Asset Uploaded', description: 'Design applied to the box.' });
      }
    } catch (err) {
      toast({ title: 'Upload Failed', description: 'Could not process image.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (!design.imageUrl) {
        toast({ title: 'No design', description: 'Please generate or upload a design first.', variant: 'destructive' });
        return;
    }
    addItem({
      designId: Math.random().toString(36).substr(2, 9),
      imageUrl: design.imageUrl,
      description: `${currentTier.name} - ${design.description || 'Custom Box Design'}`,
      sizeId: currentSize.id,
      sizeLabel: currentSize.shortLabel,
      quantity,
      price: Math.round(unitPrice * 100),
      dimensions: { width: currentSize.width, height: currentSize.height, depth: currentSize.depth }
    });
    router.push('/creator/checkout');
  };

  const BoxSettingsContent = () => (
    <div className="space-y-6 pt-2">
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Layers className="h-3 w-3" /> Market Tier
            </label>
            <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                <SelectTrigger className="bg-white/50 dark:bg-muted/50 h-12">
                    <SelectValue placeholder="Select Tier" />
                </SelectTrigger>
                <SelectContent>
                    {PRODUCT_TIERS.map(tier => (
                        <SelectItem key={tier.id} value={tier.id}>
                            <div className="flex flex-col text-left py-1">
                                <span className="font-bold text-sm">{tier.name}</span>
                                <span className="text-[10px] opacity-70">{tier.material}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 space-y-1 mt-2">
                <p className="text-[11px] font-bold text-primary flex items-center gap-1">
                    <Info className="h-3 w-3" /> {currentTier.tier} Positioning
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    "{currentTier.angle}"
                </p>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Box Size</label>
            <Select value={selectedSizeId} onValueChange={setSelectedSizeId}>
                <SelectTrigger className="bg-white/50 dark:bg-muted/50">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {BOX_SIZES.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-4 pt-4 border-t border-muted/50">
            <div className="flex justify-between items-center">
                 <label className="text-[10px] font-bold uppercase text-muted-foreground">Order Quantity</label>
                 <div className="flex items-center gap-2">
                     {quantity === currentTier.minQty && <Badge variant="outline" className="text-[8px] h-4">Min Order</Badge>}
                     <span className="text-sm font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{quantity}</span>
                 </div>
            </div>
            <Slider 
                value={[quantity]} 
                min={currentTier.minQty} 
                max={1000} 
                step={currentTier.id === 'keepsake' ? 1 : 10} 
                onValueChange={(v) => setQuantity(v[0])}
                className="py-4"
            />
        </div>

        <div className="bg-primary/5 rounded-xl p-4 space-y-2 border border-primary/10">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Unit price ({currentTier.material})</span>
                <span className="font-bold text-primary">${unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total Est.</span>
                <span>${(unitPrice * quantity).toFixed(2)}</span>
            </div>
        </div>
    </div>
  );

  const BoxDesignContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
        {/* Artwork Library */}
        <div className="p-4 space-y-3">
             <label className="text-[10px] font-bold uppercase text-muted-foreground">Artwork Library</label>
             <div className="grid grid-cols-4 gap-2">
                {assets.slice(0, 8).map(asset => (
                    <button 
                        key={asset.id} 
                        onClick={() => setDesign({ imageUrl: asset.url, description: 'Applied from library' })}
                        className={cn("aspect-square rounded-md overflow-hidden border-2 transition-all hover:scale-105", design.imageUrl === asset.url ? 'border-primary ring-2 ring-primary/20' : 'border-muted')}
                    >
                        <img src={asset.url} alt="asset" className="w-full h-full object-cover" />
                    </button>
                ))}
                {assets.length === 0 && (
                    <div className="col-span-4 py-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center opacity-40">
                         <ImageIcon className="h-6 w-6 mb-1" />
                         <span className="text-[8px] uppercase font-bold">No assets</span>
                    </div>
                )}
             </div>
        </div>

        <Separator />

        {/* AI Chatbot Interface */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 flex items-center justify-between">
                 <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" /> AI Designer Assistant
                 </label>
                 <div className="flex gap-1">
                     <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[9px] text-muted-foreground uppercase font-medium">Online</span>
                 </div>
            </div>

            <div className="flex-1 px-4 overflow-y-auto space-y-4 custom-scrollbar pb-4">
                <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none text-xs text-muted-foreground leading-relaxed italic">
                    "Describe your brand vision and I'll generate a production-ready concept for your {currentTier.material} box."
                </div>
                {isGenerating && (
                     <div className="flex items-center gap-2 bg-primary/5 p-3 rounded-2xl animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-xs text-primary font-medium">Generating your masterpiece...</span>
                     </div>
                )}
                {design.imageUrl && design.description && !isGenerating && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-primary/10 p-3 rounded-2xl rounded-tr-none text-xs text-primary-foreground bg-primary/80">
                            Check out this concept for {currentTier.name}.
                        </div>
                        <div className="rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg group relative">
                            <img src={design.imageUrl} alt="AI Preview" className="w-full aspect-video object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button size="sm" variant="secondary" className="h-7 text-[10px] uppercase font-bold" onClick={() => fetchAssets()}>
                                    Refresh View
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 mt-auto border-t bg-white/50 dark:bg-muted/20">
                <form action={generateAction} className="relative">
                    <Input 
                        name="prompt"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="e.g. Minimalist floral pattern..." 
                        className="pr-10 h-10 text-xs rounded-full bg-white dark:bg-background border-muted/50 focus-visible:ring-primary/20"
                        disabled={isGenerating}
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-primary hover:bg-primary/10"
                        disabled={isGenerating || !aiInput.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>

        <div className="p-4 bg-primary/5 border-t">
             <Button onClick={handleAddToCart} disabled={!design.imageUrl} className="w-full rounded-full py-6 font-bold shadow-lg shadow-primary/20 uppercase tracking-tighter">
                <ShoppingCart className="h-4 w-4 mr-2" /> Add {currentTier.name} to Cart
             </Button>
        </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-60px)] overflow-hidden bg-[#F8F9FA] dark:bg-[#0c0c0c]">
      {/* 1. Full Screen 3D Workspace */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
         <ThreePreview 
            key={`${design.imageUrl}-${selectedSizeId}-${selectedTierId}`} 
            imageUrl={design.imageUrl} 
            dimensions={{ width: currentSize.width, height: currentSize.height, depth: currentSize.depth }}
          />
      </div>

      {/* 2. Floating Top Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
         <div className="flex items-center gap-1 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-xl rounded-full px-4 py-2">
            <TooltipProvider>
                <label className="cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Upload Artwork</TooltipContent>
                    </Tooltip>
                </label>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><Type className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Text</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><Brush className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Mode</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><Save className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Save Template</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Share Preview</TooltipContent>
                </Tooltip>
            </TooltipProvider>
         </div>
      </div>

      {/* 3. Floating Left Sidebar: Box Settings (Desktop) */}
      <div className="absolute left-6 top-6 bottom-6 z-20 w-80 hidden lg:block">
         <Card className="h-full bg-white/90 dark:bg-black/60 backdrop-blur-md border-white/20 shadow-2xl flex flex-col rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 bg-primary/5 border-b border-primary/10">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Settings2 className="h-4 w-4" /> Package Config
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
                <BoxSettingsContent />
            </CardContent>
         </Card>
      </div>

      {/* 4. Floating Right Sidebar: Box Design & AI (Desktop) */}
      <div className="absolute right-6 top-6 bottom-6 z-20 w-80 hidden xl:block">
         <Card className="h-full bg-white/90 dark:bg-black/60 backdrop-blur-md border-white/20 shadow-2xl flex flex-col rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 bg-primary/5 border-b border-primary/10">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> AI Design Studio
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <BoxDesignContent />
            </CardContent>
         </Card>
      </div>

      {/* 5. Mobile Controls (Floating Drawers) */}
      <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 w-full px-6">
        <Sheet>
            <SheetTrigger asChild>
                <Button size="lg" className="flex-1 rounded-full shadow-lg gap-2">
                    <Settings2 className="h-4 w-4" /> Settings
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] px-6">
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-left font-headline">Package Configuration</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto pb-10">
                    <BoxSettingsContent />
                </div>
            </SheetContent>
        </Sheet>

        <Sheet>
            <SheetTrigger asChild>
                <Button size="lg" variant="secondary" className="flex-1 rounded-full shadow-lg gap-2">
                    <ImageIcon className="h-4 w-4" /> AI Studio
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-[32px] p-0 flex flex-col">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-left font-headline">Design & AI assistant</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                    <BoxDesignContent />
                </div>
            </SheetContent>
        </Sheet>
      </div>

      {/* Floating Cart (Mobile) */}
      <div className="lg:hidden absolute top-6 right-6 z-20">
          <Button size="icon" variant="secondary" onClick={handleAddToCart} className="rounded-full h-12 w-12 shadow-xl border border-white/20">
             <ShoppingCart className="h-5 w-5" />
          </Button>
      </div>
    </div>
  );
}
