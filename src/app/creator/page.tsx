'use client';

import { useState, useRef, useEffect } from 'react';
import AiDesignForm from '@/components/ai-design-form';
import ThreePreview from '@/components/three-preview';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Brush, Share2, Type, Save, Shapes, Package2, Sparkles, Box, CreditCard, ShoppingBag, Users, Loader2, Maximize2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import RequestHelpDialog from '@/components/request-help-dialog';
import { cn } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import { handleCreateOrderSession, handleUploadDesignImage, getUserAssets, type Asset } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const BOX_SIZES = [
    { id: 'small-cube', label: 'Small Cube (4"x4"x4")', width: 4, height: 4, depth: 4 },
    { id: 'medium-cube', label: 'Medium Cube (8"x8"x8")', width: 8, height: 8, depth: 8 },
    { id: 'large-cube', label: 'Large Cube (12"x12"x12")', width: 12, height: 12, depth: 12 },
    { id: 'small-mailer', label: 'Small Mailer (6"x6"x2")', width: 6, height: 2, depth: 6 },
    { id: 'medium-mailer', label: 'Medium Mailer (10"x8"x2")', width: 10, height: 2, depth: 8 },
    { id: 'large-mailer', label: 'Large Mailer (12.5"x9.5"x4")', width: 12.5, height: 4, depth: 9.5 },
];

const AiToolDialog = ({ onDesignGenerated }: { onDesignGenerated: (design: { imageUrl: string; description: string }) => void; }) => {
  const [open, setOpen] = useState(false);
  
  const handleGenerated = (design: { imageUrl: string; description: string }) => {
    onDesignGenerated(design);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
           <Button variant="ghost" className="flex flex-col items-center justify-center h-auto w-16 gap-1 p-2 flex-shrink-0 text-primary
                                              lg:flex-row lg:w-full lg:justify-start lg:h-12 lg:gap-4 lg:px-3">
                <Sparkles className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs lg:text-base">AI Create</span>
            </Button>
        </DialogTrigger>
      </TooltipTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">AI Designer</DialogTitle>
           <DialogDescription>Describe your idea and let AI create a design for you.</DialogDescription>
        </DialogHeader>
        <AiDesignForm onDesignGenerated={handleGenerated} />
      </DialogContent>
    </Dialog>
  )
}

const EditorSidebar = ({ onDesignGenerated, onImageUploaded, isUploading, className }: { onDesignGenerated: (design: { imageUrl: string; description: string }) => void; onImageUploaded: (url: string) => void; isUploading: boolean; className?: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        onImageUploaded('UPLOAD_START'); // Signal start
        
        try {
            const result = await handleUploadDesignImage(formData);
            if (result.success && result.imageUrl) {
                onImageUploaded(result.imageUrl);
            } else {
                onImageUploaded('UPLOAD_ERROR:' + result.message);
            }
        } catch (err) {
            onImageUploaded('UPLOAD_ERROR:Unexpected error during upload.');
        }
    };

    const tools = [
        { icon: Type, label: 'Text', tooltip: 'Add Text' },
        { icon: Brush, label: 'Edit', tooltip: 'Edit Design' },
        { icon: Save, label: 'Save', tooltip: 'Save' },
        { icon: Share2, label: 'Share', tooltip: 'Share' },
    ];

    return (
        <aside id="toolbar" className={cn("flex flex-row lg:flex-col w-full lg:w-64 justify-between items-center lg:items-stretch border-b lg:border-r lg:border-b-0 bg-background p-2 lg:p-0", className)}>
             <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2 lg:space-y-2 lg:p-4 lg:mt-4 overflow-x-auto">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <AiToolDialog onDesignGenerated={onDesignGenerated} />
                      <TooltipContent side="right" sideOffset={5} className="hidden lg:block">AI Create</TooltipContent>
                      <TooltipContent side="bottom" className="lg:hidden">AI Create</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            disabled={isUploading}
                            onClick={handleUploadClick}
                            className="flex flex-col items-center justify-center h-auto w-16 gap-1 p-2 flex-shrink-0 lg:flex-row lg:w-full lg:justify-start lg:h-12 lg:gap-4 lg:px-3"
                          >
                              {isUploading ? <Loader2 className="h-5 w-5 lg:h-6 lg:w-6 animate-spin" /> : <Upload className="h-5 w-5 lg:h-6 lg:w-6" />}
                              <span className="text-xs lg:text-base">Upload</span>
                          </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={5} className="hidden lg:block">Upload Image (Max 10MB)</TooltipContent>
                      <TooltipContent side="bottom" className="lg:hidden">Upload Image</TooltipContent>
                  </Tooltip>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />

                  <Separator orientation="vertical" className="h-8 lg:hidden" />
                  <Separator className="my-4 hidden lg:block" />

                  {tools.map(tool => (
                      <Tooltip key={tool.label}>
                          <TooltipTrigger asChild>
                              <Button variant="ghost" className="flex flex-col items-center justify-center h-auto w-16 gap-1 p-2 flex-shrink-0
                                                                  lg:flex-row lg:w-full lg:justify-start lg:h-12 lg:gap-4 lg:px-3">
                                  <tool.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                                  <span className="text-xs lg:text-base">{tool.label}</span>
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={5} className="hidden lg:block">{tool.tooltip}</TooltipContent>
                          <TooltipContent side="bottom" className="lg:hidden">{tool.tooltip}</TooltipContent>
                      </Tooltip>
                  ))}
                </TooltipProvider>
             </div>

              <div className="lg:mt-auto lg:border-t lg:p-4 p-2">
                    <RequestHelpDialog>
                         <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="secondary" className="flex flex-col items-center justify-center h-auto w-18 gap-1 p-2 flex-shrink-0
                                                                          lg:flex-row lg:w-full lg:justify-start lg:h-12 lg:gap-4 lg:px-3">
                                        <Users className="h-5 w-5 lg:h-6 lg:w-6" />
                                        <span className="text-xs lg:text-base">Support</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5} className="hidden lg:block">Request Help</TooltipContent>
                                <TooltipContent side="bottom" className="lg:hidden">Request Help</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </RequestHelpDialog>
                </div>
        </aside>
    );
};

const AssetLibrary = ({ assets, onSelect, activeUrl }: { assets: Asset[], onSelect: (url: string) => void, activeUrl?: string }) => {
    if (assets.length === 0) return null;

    return (
        <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">My Assets</h4>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                {assets.map(asset => (
                    <button
                        key={asset.id}
                        onClick={() => onSelect(asset.url)}
                        className={cn(
                            "aspect-square rounded-md overflow-hidden border-2 transition-all hover:scale-105 relative",
                            activeUrl === asset.url ? "border-primary ring-2 ring-primary/20" : "border-muted"
                        )}
                    >
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        {activeUrl === asset.url && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                <Check className="text-primary h-4 w-4 bg-background rounded-full p-0.5" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};


export default function CreatorPage() {
  const [design, setDesign] = useState<{ imageUrl?: string; description?: string }>({});
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState('medium-cube');
  const [isUploading, setIsUploading] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const { toast } = useToast();

  const currentSize = BOX_SIZES.find(s => s.id === selectedSizeId) || BOX_SIZES[1];

  const fetchAssets = async () => {
      const data = await getUserAssets();
      setAssets(data);
  };

  useEffect(() => {
      fetchAssets();
  }, []);

  const handleDesignGenerated = (newDesign: { imageUrl: string; description:string }) => {
    setDesign(newDesign);
  };

  const handleImageUploaded = (result: string) => {
      if (result === 'UPLOAD_START') {
          setIsUploading(true);
          return;
      }
      if (result.startsWith('UPLOAD_ERROR:')) {
          toast({ title: 'Upload Failed', description: result.split('UPLOAD_ERROR:')[1], variant: 'destructive' });
          setIsUploading(false);
          return;
      }
      
      setDesign({ imageUrl: result, description: 'Custom uploaded design' });
      setIsUploading(false);
      fetchAssets(); // Refresh library
      toast({ title: 'Success', description: 'Image uploaded and applied to design.' });
  };
  
  const handleOrder = async () => {
    if (!design.imageUrl || !design.description) {
        toast({
            title: 'No design to order',
            description: 'Please generate or upload a design first before ordering a print.',
            variant: 'destructive'
        });
        return;
    }
    setIsOrdering(true);
    try {
        const { sessionId, error } = await handleCreateOrderSession({
            designImageUrl: design.imageUrl,
            designDescription: `${design.description} (Size: ${currentSize.label})`,
        });

        if (error) {
            toast({ title: 'Error', description: error, variant: 'destructive'});
            setIsOrdering(false);
            return;
        }

        if (sessionId) {
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
            if (!stripe) {
                throw new Error('Stripe.js not loaded');
            }
            await stripe.redirectToCheckout({ sessionId });
        }
    } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive'});
        setIsOrdering(false);
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full lg:h-[calc(100vh-60px)]">
      <EditorSidebar 
        onDesignGenerated={handleDesignGenerated} 
        onImageUploaded={handleImageUploaded}
        isUploading={isUploading}
      />
      
      <div className="flex-1 flex flex-col p-2 sm:p-4 lg:p-6 overflow-auto">
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <Card className="flex flex-col shadow-lg min-h-[50vh] xl:min-h-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="font-headline">3D Real-time Preview</CardTitle>
                  <CardDescription>Rotate with cursor to see all sides.</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={selectedSizeId} onValueChange={setSelectedSizeId}>
                        <SelectTrigger className="w-full sm:w-[220px]">
                            <SelectValue placeholder="Standard Dimensions" />
                        </SelectTrigger>
                        <SelectContent>
                            {BOX_SIZES.map(size => (
                                <SelectItem key={size.id} value={size.id}>{size.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 bg-muted/20 rounded-b-lg">
              <ThreePreview 
                key={`${design.imageUrl}-${selectedSizeId}`} 
                imageUrl={design.imageUrl} 
                productType="box" 
                dimensions={{ width: currentSize.width, height: currentSize.height, depth: currentSize.depth }}
              />
            </CardContent>
          </Card>
          <Card className="flex flex-col shadow-lg min-h-[50vh] xl:min-h-0">
            <CardHeader>
              <CardTitle className="font-headline">Design Assets</CardTitle>
              <CardDescription>Manage your generated or uploaded imagery.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6">
              <div className="w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden border group relative">
                  {design.imageUrl ? (
                      <img src={design.imageUrl} alt="Active design" className="w-full h-full object-contain" />
                  ) : (
                      <div className="text-center text-muted-foreground p-4">
                          <Package2 size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Your design will appear here.</p>
                      </div>
                  )}
                  {isUploading && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
                          <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                          <p className="text-sm font-medium">Processing upload...</p>
                      </div>
                  )}
              </div>

              <AssetLibrary 
                assets={assets} 
                activeUrl={design.imageUrl} 
                onSelect={(url) => setDesign({ imageUrl: url, description: 'Applied from library' })} 
              />

              <div className="p-4 bg-muted/50 rounded-lg text-sm h-24 overflow-y-auto border">
                  <p className="text-muted-foreground italic">
                    {design.description || "The description of the current design will be shown here. Use the sidebar tools to generate a new design or upload your own assets."}
                  </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <div className="flex w-full items-center justify-between text-sm text-muted-foreground px-1">
                    <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" /> Size: {currentSize.label}</span>
                    <span>Format: High-Res Print Ready</span>
                </div>
                <Button onClick={handleOrder} disabled={!design.imageUrl || isOrdering || isUploading} className="w-full py-6 text-lg font-bold">
                    {isOrdering ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <ShoppingBag className="mr-2 h-5 w-5" />
                    )}
                    {isOrdering ? 'Processing Order...' : 'Order Custom Print ($49.99)'}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
