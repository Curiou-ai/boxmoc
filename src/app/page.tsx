'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/header';
import AiDesignForm from '@/components/ai-design-form';
import ThreePreview from '@/components/three-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Brush, Type, Shapes, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [design, setDesign] = useState<{ imageUrl?: string; description?: string }>({});

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 lg:w-96 p-4 border-r overflow-y-auto flex flex-col gap-6 bg-card">
          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Generate with AI</CardTitle>
              <CardDescription>Describe your box and let AI create a design for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <AiDesignForm onDesignGenerated={(newDesign) => setDesign(newDesign)} />
            </CardContent>
          </Card>
          
          <Separator />
          
          <div>
            <h2 className="text-lg font-semibold font-headline mb-4 px-2">Design Tools</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline"><Upload className="mr-2"/> Upload</Button>
              <Button variant="outline"><Type className="mr-2"/> Text</Button>
              <Button variant="outline"><Shapes className="mr-2"/> Shapes</Button>
              <Button variant="outline"><Brush className="mr-2"/> Edit</Button>
            </div>
          </div>
        </aside>
        
        <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
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
