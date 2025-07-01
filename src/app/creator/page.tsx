'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/header';
import AiDesignForm from '@/components/ai-design-form';
import ThreePreview from '@/components/three-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Brush, Type, Shapes, Package2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import RequestHelpDialog from '@/components/request-help-dialog';

const DesignSidebarContent = ({ onDesignGenerated, className }: { onDesignGenerated: (design: { imageUrl: string; description: string }) => void; className?:string }) => (
    <div className={className}>
        <Card className="shadow-none border-none bg-transparent">
            <CardHeader className="px-0 pt-0 sm:px-2">
              <CardTitle className="font-headline text-xl">Generate with AI</CardTitle>
              <CardDescription>Describe your idea and let AI create a design for you.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-2">
              <AiDesignForm onDesignGenerated={onDesignGenerated} />
            </CardContent>
        </Card>
        
        <Separator />
        
        <div>
            <h2 className="text-lg font-semibold font-headline mb-4 px-0 sm:px-2">Design Tools</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Upload</Button>
              <Button variant="outline"><Type className="mr-2 h-4 w-4"/> Text</Button>
              <Button variant="outline"><Shapes className="mr-2 h-4 w-4"/> Shapes</Button>
              <Button variant="outline"><Brush className="mr-2 h-4 w-4"/> Edit</Button>
            </div>
        </div>

        <Separator />

        <div>
            <div className="px-0 sm:px-2">
                <h2 className="text-lg font-semibold font-headline mb-2">Expert Assistance</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Need a professional touch? Our design team can help bring your vision to life.
                </p>
                <RequestHelpDialog />
            </div>
        </div>
    </div>
);


export default function CreatorPage() {
  const [design, setDesign] = useState<{ imageUrl?: string; description?: string }>({});

  const handleDesignGenerated = (newDesign: { imageUrl: string; description: string }) => {
    setDesign(newDesign);
  };

  const mobileSidebar = (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-4 overflow-y-auto bg-card">
            <DesignSidebarContent onDesignGenerated={handleDesignGenerated} className="flex flex-col gap-6" />
        </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AppHeader mobileSidebar={mobileSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-80 lg:w-96 p-4 border-r overflow-y-auto bg-card">
          <DesignSidebarContent onDesignGenerated={handleDesignGenerated} className="flex flex-col gap-6" />
        </aside>
        
        <main className="flex-1 flex flex-col p-2 sm:p-4 lg:p-6 overflow-hidden">
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <Card className="flex flex-col shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">3D Preview</CardTitle>
                <CardDescription>A real-time preview of your design.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <ThreePreview key={design.imageUrl} imageUrl={design.imageUrl} />
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
        </main>
      </div>
    </div>
  );
}
