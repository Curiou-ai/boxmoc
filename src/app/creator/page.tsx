
'use client';

import { useState } from 'react';
import AiDesignForm from '@/components/ai-design-form';
import ThreePreview from '@/components/three-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Brush, Type, Shapes, Package2, Sparkles, Box, CreditCard, ShoppingBag, Users, Settings, Home, CreditCardIcon } from 'lucide-react';
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
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
           <Button variant="ghost" className="flex justify-start items-center gap-4 w-full h-12 px-3 text-base">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="lg:inline hidden">Generate with AI</span>
            </Button>
        </DialogTrigger>
      </TooltipTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Generate with AI</DialogTitle>
           <DialogDescription>Describe your idea and let AI create a design for you.</DialogDescription>
        </DialogHeader>
        <AiDesignForm onDesignGenerated={handleGenerated} />
      </DialogContent>
    </Dialog>
  )
}

const EditorSidebar = ({ onDesignGenerated, className }: { onDesignGenerated: (design: { imageUrl: string; description: string }) => void; className?: string }) => {

    const tools = [
        { icon: Upload, label: 'Upload', tooltip: 'Upload Image' },
        { icon: Type, label: 'Text', tooltip: 'Add Text' },
        { icon: Shapes, label: 'Shapes', tooltip: 'Add Shape' },
        { icon: Brush, label: 'Edit', tooltip: 'Edit Design' },
    ];

    return (
        <aside className={cn("hidden lg:flex lg:w-64 flex-col border-r bg-background", className)}>
             <div className="flex-1 p-2 lg:p-4 space-y-2 mt-4">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <AiToolDialog onDesignGenerated={onDesignGenerated} />
                      <TooltipContent side="right" sideOffset={5} className="lg:hidden">
                        Generate with AI
                      </TooltipContent>
                  </Tooltip>
                  
                  <Separator className="my-4" />
                  
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</p>

                  {tools.map(tool => (
                      <Tooltip key={tool.label}>
                          <TooltipTrigger asChild>
                              <Button variant="ghost" className="w-full justify-start gap-4 h-12 px-3 text-base">
                                  <tool.icon className="h-6 w-6" />
                                  <span>{tool.label}</span>
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={5} className="lg:hidden">
                              {tool.tooltip}
                          </TooltipContent>
                      </Tooltip>
                  ))}
                </TooltipProvider>
             </div>

              <div className="p-2 lg:p-4 mt-auto border-t">
                    <RequestHelpDialog>
                         <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="secondary" className="w-full justify-start gap-4 h-12 px-3 text-base">
                                        <Users className="h-6 w-6" />
                                        <span>Request Help</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5} className="lg:hidden">
                                    Get Expert Help
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </RequestHelpDialog>
                </div>
        </aside>
    );
};


export default function CreatorPage() {
  const [design, setDesign] = useState<{ imageUrl?: string; description?: string }>({});
  const [productType, setProductType] = useState('box');

  const handleDesignGenerated = (newDesign: { imageUrl: string; description:string }) => {
    setDesign(newDesign);
  };
  
  return (
    <div className="flex flex-1 h-[calc(100vh-60px)]">
      <EditorSidebar onDesignGenerated={handleDesignGenerated} />
      
      <div className="flex-1 flex flex-col p-2 sm:p-4 lg:p-6 overflow-hidden">
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <Card className="flex flex-col shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="font-headline">3D Preview</CardTitle>
                  <CardDescription>A real-time preview of your design.</CardDescription>
                </div>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="box">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4" /> Promotional Box
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Card
                      </div>
                    </SelectItem>
                    <SelectItem value="bag">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" /> Tote Bag
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ThreePreview key={`${design.imageUrl}-${productType}`} imageUrl={design.imageUrl} productType={productType} />
            </CardContent>
          </Card>
          <Card className="flex flex-col shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">AI Generated Design</CardTitle>
              <CardDescription>The image and description from the AI.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden border">
                  {design.imageUrl ? (
                      <img src={design.imageUrl} alt="Generated box design" className="w-full h-full object-cover" />
                  ) : (
                      <div className="text-center text-muted-foreground p-4">
                          <Package2 size={48} className="mx-auto mb-2" />
                          <p>Your generated design will appear here.</p>
                      </div>
                  )}
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-sm flex-grow h-40 overflow-y-auto border">
                  <p className="text-muted-foreground">{design.description || "The AI's description of the design will be shown here."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
